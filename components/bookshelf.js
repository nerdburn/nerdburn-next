import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// A draggable 3D shelf. Books sit spine-out; clicking one pulls it off the
// shelf and turns it to show its cover, which is only loaded at that point.

const FONT = 'Helvetica, Arial, sans-serif'
const PAGE_COLOR = '#efe9da'
const BOARD = 0.024 // thickness of a hardcover board
const PAGE_INSET = 0.04 // how far the pages sit inside the boards

// [cover, ink] pairs, one per series
const PALETTE = [
  ['#1f2a44', '#f4efe4'],
  ['#7a2e2e', '#f6ead9'],
  ['#e8dfcb', '#272727'],
  ['#2f4f3e', '#efe8d6'],
  ['#c9a227', '#1c1c1c'],
  ['#272727', '#f2efe6'],
  ['#8c5a3c', '#f7efe2'],
  ['#4b6a88', '#f4f1ea'],
  ['#d9c7b0', '#3a2a20'],
  ['#5b3a5e', '#f1e9f2'],
  ['#b5482f', '#fbf1e6'],
  ['#3d6b6b', '#eef3ee'],
  ['#a8b08c', '#22261a'],
  ['#f2efe6', '#272727']
]

const BOOK_GAP = 0.018
const SERIES_GAP = 0.3
const EDGE_PAD = 0.7
const CAMERA_FOV = 32
const CAMERA_Z = 6.6
const CAMERA_Y = 2.5
const LOOK_Y = 0.45
const PULL_CLEARANCE = 0.12
const SHOW_CLEARANCE = 0.25
const HOVER_Z = 0.14
const CLICK_SLOP = 6

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const damp = THREE.MathUtils.damp

// Deterministic 0..1 generator so a book looks the same on every visit
const seeded = (text) => {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const layoutBooks = (books) => {
  const seriesColors = {}
  let x = 0
  return books.map((book, index) => {
    const random = seeded(book.title + book.author)
    // Audible art is square, so the books are too
    const height = 1.6 + random() * 0.3
    const thickness = 0.14 + random() * 0.1
    const depth = height

    let colors
    if (book.series) {
      if (!seriesColors[book.series]) {
        seriesColors[book.series] = PALETTE[Object.keys(seriesColors).length % PALETTE.length]
      }
      colors = seriesColors[book.series]
    } else {
      colors = PALETTE[Math.floor(random() * PALETTE.length)]
    }

    const previous = books[index - 1]
    if (previous) {
      // Standalone books shelve together as one group, like the list below
      const sameGroup = (previous.series || '') === (book.series || '')
      x += sameGroup ? BOOK_GAP : SERIES_GAP
    }
    x += thickness / 2
    const center = x
    x += thickness / 2

    return { book, index, height, thickness, depth, x: center, cover: colors[0], ink: colors[1] }
  })
}

const fitText = (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width <= maxWidth) return text
  let cut = text
  while (cut.length > 1 && ctx.measureText(cut + '…').width > maxWidth) {
    cut = cut.slice(0, -1)
  }
  return cut.trimEnd() + '…'
}

// Shrinking the art to a few pixels and scaling it back up gives a soft blur
// that works in every browser, plus a cheap way to read its brightness
const softened = (image, sx, sw, cols, rows) => {
  const tiny = document.createElement('canvas')
  tiny.width = cols
  tiny.height = rows
  const ctx = tiny.getContext('2d')
  let luminance = 0.5
  let average = null
  if (!ctx) return { tiny, luminance, average }
  ctx.drawImage(image, sx, 0, sw, image.naturalHeight, 0, 0, cols, rows)
  try {
    const { data } = ctx.getImageData(0, 0, cols, rows)
    const pixels = data.length / 4
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
    }
    average = [r / pixels, g / pixels, b / pixels]
    luminance = (0.2126 * average[0] + 0.7152 * average[1] + 0.0722 * average[2]) / 255
  } catch (error) {
    // Unreadable pixels: keep the neutral defaults
  }
  return { tiny, luminance, average }
}

// With art, the spine is the cover's left edge wrapped around the corner
const drawSpine = (canvas, item, image) => {
  const length = 1024
  const width = Math.round((item.thickness / item.height) * length)
  canvas.width = width
  canvas.height = length
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let ink = item.ink
  if (image) {
    const strip = image.naturalWidth * 0.22
    const { tiny, luminance } = softened(image, 0, strip, 4, 24)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(tiny, 0, 0, width, length)
    const dark = luminance < 0.6
    ink = dark ? '#ffffff' : '#1c1c1c'
    ctx.fillStyle = dark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
    ctx.fillRect(0, 0, width, length)
  } else {
    ctx.fillStyle = item.cover
    ctx.fillRect(0, 0, width, length)
  }
  ctx.fillStyle = ink
  ctx.globalAlpha = 0.5
  ctx.fillRect(0, 34, width, 3)
  ctx.fillRect(0, length - 37, width, 3)
  ctx.globalAlpha = 1

  // Text reads top to bottom
  ctx.translate(width / 2, 0)
  ctx.rotate(Math.PI / 2)
  ctx.textBaseline = 'middle'

  const authorSize = Math.round(clamp(width * 0.26, 20, 30))
  ctx.font = `400 ${authorSize}px ${FONT}`
  const author = fitText(ctx, item.book.author, 330)
  const authorWidth = ctx.measureText(author).width
  ctx.globalAlpha = 0.85
  ctx.textAlign = 'right'
  ctx.fillText(author, length - 64, 2)
  ctx.globalAlpha = 1

  const available = length - 64 - 64 - authorWidth - 40
  let titleSize = Math.round(clamp(width * 0.4, 28, 52))
  ctx.font = `700 ${titleSize}px ${FONT}`
  while (titleSize > 26 && ctx.measureText(item.book.title).width > available) {
    titleSize -= 2
    ctx.font = `700 ${titleSize}px ${FONT}`
  }
  ctx.textAlign = 'left'
  ctx.fillText(fitText(ctx, item.book.title, available), 64, 2)
}

// Softened art for the closed book: the back is mirrored so the jacket reads as
// one wrapped sheet, and the front stays out of focus until the book is opened
const drawSoft = (canvas, image, mirrored) => {
  const size = 512
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { tiny, average } = softened(image, 0, image.naturalWidth, 40, 40)
  ctx.imageSmoothingQuality = 'high'
  if (mirrored) {
    ctx.translate(size, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(tiny, 0, 0, size, size)
  ctx.fillStyle = mirrored ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0)'
  ctx.fillRect(0, 0, size, size)
  return average
}

const smallCover = (url) => url.replace('._SL500_.', '._SL160_.')

const wrapLines = (ctx, text, maxWidth, maxLines) => {
  const lines = []
  let line = ''
  text.split(/\s+/).forEach((word) => {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  })
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = fitText(ctx, lines[maxLines - 1] + ' …', maxWidth)
  }
  return lines
}

// The art fills the whole front; the title only shows until it has loaded
const drawCover = (canvas, item, image) => {
  const size = 640
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (image) {
    ctx.drawImage(image, 0, 0, size, size)
    return
  }
  ctx.fillStyle = item.cover
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = item.ink
  ctx.textBaseline = 'top'
  ctx.font = `700 54px ${FONT}`
  const lines = wrapLines(ctx, item.book.title, size - 96, 4)
  lines.forEach((line, i) => ctx.fillText(line, 48, 56 + i * 64))
  ctx.globalAlpha = 0.8
  ctx.font = `400 32px ${FONT}`
  ctx.fillText(fitText(ctx, item.book.author, size - 96), 48, 56 + lines.length * 64 + 18)
  ctx.globalAlpha = 1
}

const createShelf = (canvas, books, callbacks) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const speed = reducedMotion ? 4 : 1

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 60)
  camera.position.set(0, CAMERA_Y, CAMERA_Z)
  camera.lookAt(0, LOOK_Y, 0)

  renderer.shadowMap.enabled = true

  scene.add(new THREE.HemisphereLight('#ffffff', '#b8ae9c', 1.7))

  // The key light shades the books and throws their shadows onto each other;
  // the back light throws shadows forward onto the ground in front of the row
  const makeLight = (intensity, x, y, z) => {
    const light = new THREE.DirectionalLight('#ffffff', intensity)
    light.position.set(x, y, z)
    light.target.position.set(0, 0.9, 0)
    light.castShadow = true
    light.shadow.mapSize.set(2048, 2048)
    light.shadow.camera.top = 5
    light.shadow.camera.bottom = -5
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 30
    light.shadow.bias = -0.0006
    light.shadow.normalBias = 0.02
    light.shadow.radius = 5
    scene.add(light)
    scene.add(light.target)
    return light
  }
  const shadowLights = [makeLight(2.0, -4.5, 6.5, 6), makeLight(0.9, 2.4, 9, -2.8)]

  const items = layoutBooks(books)
  const rowStart = items[0].x - items[0].thickness / 2
  const last = items[items.length - 1]
  const rowEnd = last.x + last.thickness / 2
  const maxDepth = items.reduce((max, item) => Math.max(max, item.depth), 0)

  const shelf = new THREE.Group()
  scene.add(shelf)

  const disposables = []
  const track = (thing) => {
    disposables.push(thing)
    return thing
  }

  // No shelf board: the books stand on the page itself and only their shadows show
  const groundMaterial = track(new THREE.ShadowMaterial({ opacity: 0.2 }))
  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(200, 40)), groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const pageMaterial = track(new THREE.MeshStandardMaterial({ color: PAGE_COLOR, roughness: 0.95 }))
  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

  const solid = (geometry, material) => {
    const mesh = new THREE.Mesh(track(geometry), material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  }

  const artwork = (planeWidth, planeHeight, material) => {
    const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(planeWidth, planeHeight)), material)
    mesh.receiveShadow = true
    return mesh
  }

  // Each book is built like a hardcover: two boards and a spine wrapped round a
  // recessed block of pages. Local axes: x across the pages, +z towards the spine,
  // +x the front cover.
  const meshes = items.map((item) => {
    const { thickness, height, depth } = item
    const spineCanvas = document.createElement('canvas')
    drawSpine(spineCanvas, item, null)
    const spineTexture = track(new THREE.CanvasTexture(spineCanvas))
    spineTexture.colorSpace = THREE.SRGBColorSpace
    spineTexture.anisotropy = maxAnisotropy

    const boardMaterial = track(new THREE.MeshStandardMaterial({ color: item.cover, roughness: 0.8 }))
    const frontMaterial = track(new THREE.MeshStandardMaterial({ color: item.cover, roughness: 0.7 }))
    const backMaterial = track(new THREE.MeshStandardMaterial({ color: item.cover, roughness: 0.75 }))
    const spineMaterial = track(new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.75 }))

    const group = new THREE.Group()
    group.position.set(item.x, height / 2, 0)

    const coverGeometry = track(new RoundedBoxGeometry(BOARD, height, depth, 2, 0.009))
    const frontBoard = solid(coverGeometry, boardMaterial)
    frontBoard.position.x = thickness / 2 - BOARD / 2
    const backBoard = solid(coverGeometry, boardMaterial)
    backBoard.position.x = -(thickness / 2 - BOARD / 2)
    const spineBoard = solid(new RoundedBoxGeometry(thickness, height, BOARD, 2, 0.009), boardMaterial)
    spineBoard.position.z = depth / 2 - BOARD / 2

    const pagesDepth = depth - BOARD - PAGE_INSET
    const pages = solid(
      new THREE.BoxGeometry(thickness - BOARD * 2, height - PAGE_INSET * 2, pagesDepth),
      pageMaterial
    )
    pages.position.z = depth / 2 - BOARD - pagesDepth / 2

    const frontArt = artwork(depth - 0.024, height - 0.024, frontMaterial)
    frontArt.rotation.y = Math.PI / 2
    frontArt.position.x = thickness / 2 + 0.002
    const backArt = artwork(depth - 0.024, height - 0.024, backMaterial)
    backArt.rotation.y = -Math.PI / 2
    backArt.position.x = -(thickness / 2 + 0.002)
    const spineArt = artwork(thickness - 0.02, height - 0.024, spineMaterial)
    spineArt.position.z = depth / 2 + 0.002

    group.add(frontBoard, backBoard, spineBoard, pages, frontArt, backArt, spineArt)
    group.traverse((child) => {
      child.userData.index = item.index
    })
    shelf.add(group)

    item.mesh = group
    item.boardMaterial = boardMaterial
    item.frontMaterial = frontMaterial
    item.backMaterial = backMaterial
    item.spineCanvas = spineCanvas
    item.spineTexture = spineTexture
    item.z = 0
    item.yaw = 0
    item.hover = 0
    item.tiltX = 0
    item.tiltY = 0
    return group
  })

  // A small copy of the art wraps the spine and back as soon as it arrives
  const wrapJacket = (item) => {
    if (!item.book.cover) return
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (disposed) return
      drawSpine(item.spineCanvas, item, image)
      item.spineTexture.needsUpdate = true

      item.smallImage = image
      const soften = (material, mirrored) => {
        const softCanvas = document.createElement('canvas')
        const average = drawSoft(softCanvas, image, mirrored)
        const texture = track(new THREE.CanvasTexture(softCanvas))
        texture.colorSpace = THREE.SRGBColorSpace
        material.map = texture
        material.color.set('#ffffff')
        material.needsUpdate = true
        return average
      }
      const average = soften(item.backMaterial, true)
      // The front shows this small copy until the full-size one is asked for
      if (!item.coverTexture) {
        showCover(item, false)
      } else if (!item.sharpLoaded) {
        drawCover(item.coverCanvas, item, image)
        item.coverTexture.needsUpdate = true
      }
      // Tint the board edges to match the jacket
      if (average) {
        item.boardMaterial.color.setRGB(average[0] / 255, average[1] / 255, average[2] / 255, THREE.SRGBColorSpace)
        item.boardMaterial.color.multiplyScalar(0.8)
      }
    }
    image.src = smallCover(item.book.cover)
  }

  // Puts the art on the front cover. `sharp` also fetches the full-size image,
  // which happens for covers facing a gap on load and for any book once opened.
  const showCover = (item, sharp) => {
    if (!item.coverTexture) {
      const coverCanvas = document.createElement('canvas')
      drawCover(coverCanvas, item, item.smallImage || null)
      const texture = track(new THREE.CanvasTexture(coverCanvas))
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = maxAnisotropy
      item.coverCanvas = coverCanvas
      item.coverTexture = texture
      item.frontMaterial.map = texture
      item.frontMaterial.color.set('#ffffff')
      item.frontMaterial.needsUpdate = true
    }

    if (!sharp || item.sharpRequested || !item.book.cover) return
    item.sharpRequested = true
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (disposed) return
      item.sharpLoaded = true
      drawCover(item.coverCanvas, item, image)
      item.coverTexture.needsUpdate = true
    }
    image.src = item.book.cover
  }

  let disposed = false
  items.forEach((item, index) => {
    wrapJacket(item)
    // The last book of each group has its front cover on show in the gap
    const next = items[index + 1]
    const facesGap = !next || (next.book.series || '') !== (item.book.series || '')
    if (facesGap) showCover(item, true)
  })
  let frame = 0
  let running = false
  let lastTime = 0
  let width = 1
  let height = 1
  let viewWidth = 1
  let unitsPerPixel = 0.01
  let scrollMin = 0
  let scrollMax = 0
  let scroll = null
  let scrollTarget = null
  let velocity = 0
  let hovered = null
  let selected = null

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(0, 0)
  const drag = { active: false, id: null, startX: 0, lastX: 0, lastTime: 0, travel: 0 }

  const clampScroll = (value) => clamp(value, scrollMin, scrollMax)

  const resize = () => {
    width = Math.max(1, canvas.clientWidth)
    height = Math.max(1, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    const halfTan = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))
    viewWidth = 2 * CAMERA_Z * halfTan * camera.aspect
    // Track the pointer against the plane the spines sit on
    unitsPerPixel = (2 * (CAMERA_Z - maxDepth / 2) * halfTan) / height

    shadowLights.forEach((light) => {
      light.shadow.camera.left = -(viewWidth / 2 + 3)
      light.shadow.camera.right = viewWidth / 2 + 3
      light.shadow.camera.updateProjectionMatrix()
    })

    scrollMin = rowStart - EDGE_PAD + viewWidth / 2
    scrollMax = rowEnd + EDGE_PAD - viewWidth / 2
    if (scrollMin > scrollMax) {
      scrollMin = scrollMax = (rowStart + rowEnd) / 2
    }
    scroll = scroll === null ? scrollMin : clampScroll(scroll)
    if (scrollTarget !== null) scrollTarget = clampScroll(scrollTarget)
  }

  const setHovered = (index) => {
    if (index === hovered) return
    hovered = index
    callbacks.onHover(index)
  }

  const setSelected = (index) => {
    if (index === selected) return
    selected = index
    if (index !== null) {
      showCover(items[index], true)
      scrollTarget = clampScroll(items[index].x)
      velocity = 0
    }
    callbacks.onSelect(index)
  }

  const pick = (event) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(meshes, true)[0]
    return hit ? hit.object.userData.index : null
  }

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return
    drag.active = true
    drag.id = event.pointerId
    drag.startX = drag.lastX = event.clientX
    drag.lastTime = performance.now()
    drag.travel = 0
    velocity = 0
    scrollTarget = null
    canvas.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (drag.active && event.pointerId === drag.id) {
      const dx = event.clientX - drag.lastX
      const now = performance.now()
      const dt = Math.max(1, now - drag.lastTime) / 1000
      drag.lastX = event.clientX
      drag.lastTime = now
      drag.travel += Math.abs(dx)
      const move = -dx * unitsPerPixel
      scroll = clampScroll(scroll + move)
      velocity = velocity * 0.6 + (move / dt) * 0.4
      if (drag.travel > CLICK_SLOP) {
        canvas.classList.add('is-dragging')
        setHovered(null)
      }
      return
    }
    if (event.pointerType === 'touch') return
    const index = pick(event)
    setHovered(index)
    canvas.style.cursor = index === null ? '' : 'pointer'
  }

  const endDrag = (event, cancelled) => {
    if (!drag.active || event.pointerId !== drag.id) return
    drag.active = false
    canvas.classList.remove('is-dragging')
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    if (cancelled) return

    if (drag.travel <= CLICK_SLOP) {
      velocity = 0
      const index = pick(event)
      setSelected(index === selected ? null : index)
    } else if (performance.now() - drag.lastTime > 80 || reducedMotion) {
      velocity = 0
    }
  }

  const onPointerUp = (event) => endDrag(event, false)
  const onPointerCancel = (event) => endDrag(event, true)

  const onPointerLeave = () => {
    if (drag.active) return
    pointer.set(0, 0)
    setHovered(null)
    canvas.style.cursor = ''
  }

  const onWheel = (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
    event.preventDefault()
    scrollTarget = null
    velocity = 0
    scroll = clampScroll(scroll + event.deltaX * unitsPerPixel)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setSelected(null)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      velocity = 0
      scrollTarget = clampScroll((scrollTarget === null ? scroll : scrollTarget) + direction * viewWidth * 0.4)
    }
  }

  const update = (dt) => {
    if (!drag.active) {
      if (scrollTarget !== null) {
        scroll = damp(scroll, scrollTarget, 7 * speed, dt)
        if (Math.abs(scroll - scrollTarget) < 0.001) scrollTarget = null
      } else if (Math.abs(velocity) > 0.01) {
        scroll = clampScroll(scroll + velocity * dt)
        velocity *= Math.exp(-3.5 * dt)
        if (scroll === scrollMin || scroll === scrollMax) velocity = 0
      }
    }
    shelf.position.x = -scroll

    items.forEach((item) => {
      const isSelected = item.index === selected
      item.hover = damp(item.hover, item.index === hovered && !isSelected ? 1 : 0, 14 * speed, dt)

      // Slide clear of the neighbours, turn, then settle back against the spines.
      // Putting it away runs the same three steps in reverse.
      const pullZ = item.depth / 2 + maxDepth / 2 + PULL_CLEARANCE
      const turnAt = pullZ - 0.2
      const showZ = maxDepth / 2 + item.thickness / 2 + SHOW_CLEARANCE
      const facing = Math.abs(item.yaw + Math.PI / 2) < 0.06
      let zTarget
      let yawTarget
      if (isSelected) {
        if (facing) {
          zTarget = showZ
          yawTarget = -Math.PI / 2
        } else {
          zTarget = pullZ
          yawTarget = item.z > turnAt ? -Math.PI / 2 : item.yaw
        }
      } else if (Math.abs(item.yaw) > 0.06) {
        zTarget = pullZ
        yawTarget = item.z > turnAt ? 0 : item.yaw
      } else {
        zTarget = item.hover * HOVER_Z
        yawTarget = 0
      }
      item.z = damp(item.z, zTarget, 9 * speed, dt)
      item.yaw = damp(item.yaw, yawTarget, 9 * speed, dt)
      // An open book leans a little towards the cursor so its edges catch the light
      const lean = isSelected && facing && !drag.active ? 1 : 0
      item.tiltY = damp(item.tiltY, lean * clamp(pointer.x, -1, 1) * 0.5, 6 * speed, dt)
      item.tiltX = damp(item.tiltX, lean * clamp(pointer.y, -1, 1) * -0.16, 6 * speed, dt)
      item.mesh.position.z = item.z
      item.mesh.rotation.y = item.yaw + item.tiltY
      item.mesh.rotation.x = item.tiltX
    })
  }

  const tick = (time) => {
    if (!running || disposed) return
    frame = requestAnimationFrame(tick)
    const dt = clamp((time - lastTime) / 1000 || 1 / 60, 0, 0.05)
    lastTime = time
    update(dt)
    renderer.render(scene, camera)
  }

  const start = () => {
    if (running || disposed) return
    running = true
    lastTime = performance.now()
    frame = requestAnimationFrame(tick)
  }

  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start() : stop()))
  })
  visibilityObserver.observe(canvas)

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerCancel)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('wheel', onWheel, { passive: false })
  canvas.addEventListener('keydown', onKeyDown)

  resize()
  update(0)
  renderer.render(scene, camera)

  return {
    close: () => setSelected(null),
    dispose: () => {
      disposed = true
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerCancel)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('keydown', onKeyDown)
      disposables.forEach((thing) => thing.dispose())
      renderer.dispose()
    }
  }
}

const Bookshelf = ({ books }) => {
  const canvasRef = useRef(null)
  const shelfRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || books.length === 0) return
    let shelf
    try {
      shelf = createShelf(canvasRef.current, books, { onHover: setHovered, onSelect: setSelected })
    } catch (error) {
      console.error('3D bookshelf unavailable', error)
      setFailed(true)
      return
    }
    shelfRef.current = shelf
    return () => {
      shelfRef.current = null
      shelf.dispose()
    }
  }, [books])

  if (failed || books.length === 0) return null

  const book = books[selected !== null ? selected : hovered]

  return (
    <div className='shelf'>
      <div className='shelf-bleed'>
        <canvas
          ref={canvasRef}
          className='shelf-canvas'
          tabIndex={0}
          aria-label={`Three-dimensional shelf of ${books.length} books. Drag or use the arrow keys to browse. The same books are listed below.`}
        />
      </div>
      <div className='shelf-caption' aria-live='polite'>
        {!book && <p className='shelf-hint'>Drag the shelf to browse. Click a book to pull it out.</p>}
        {book && (
          <p>
            <strong>{book.title}</strong> <span className='author'>{book.author}</span>
            {book.series && <span className='author'> · {book.series}</span>}
          </p>
        )}
        {selected !== null && book && (
          <p className='shelf-actions'>
            {book.url && <a href={book.url}>View on Audible</a>}
            <button type='button' onClick={() => shelfRef.current && shelfRef.current.close()}>Put it back</button>
          </p>
        )}
      </div>
    </div>
  )
}

export default Bookshelf
