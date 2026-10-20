import { jsPDF } from 'jspdf'
import './style.css'

const icons = {
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m5 18 4.5-4.5 3 3 2-2L19 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
  grip: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/></svg>',
  moveTop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14M12 19V9M8 13l4-4 4 4"/></svg>',
  moveUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M7 11l5-5 5 5"/></svg>',
  moveDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v13M7 13l5 5 5-5"/></svg>',
  moveBottom: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h14M12 5v10M8 11l4 4 4-4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
}

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Pic2PDF 首页">
      <span class="brand-mark">P<span>2</span></span>
      <span>Pic<span class="brand-accent">2</span>PDF</span>
    </a>
    <div class="privacy-pill">${icons.lock}<span>100% 本地处理</span></div>
  </header>

  <main>
    <section class="intro">
      <div><p class="eyebrow">FAST · PRIVATE · FREE</p>
      <h1>图片转 <em>PDF</em></h1></div>
      <p class="lead">无需上传，无需等待。所有处理都在你的浏览器中完成。</p>
    </section>

    <section class="workspace" aria-label="图片转 PDF 工具">
      <section class="settings" aria-label="PDF 设置">
        <div class="settings-heading">
          <div><span class="section-kicker">01 · 设置</span><h2>PDF 选项</h2></div>
          <p>${icons.lock} 图片只在此设备上处理</p>
        </div>
        <div class="settings-grid">
          <div class="control-group name-control">
            <label class="field-label" for="fileName">文件名</label>
            <div class="filename-wrap"><input id="fileName" value="我的图片" maxlength="80" /><span>.pdf</span></div>
          </div>

          <fieldset class="control-group">
            <legend>页面尺寸</legend>
            <div class="segmented" id="pageSize">
              <button type="button" class="active" data-value="a4">A4</button>
              <button type="button" data-value="letter">Letter</button>
              <button type="button" data-value="image">适应图片</button>
            </div>
          </fieldset>

          <fieldset id="orientationField" class="control-group">
            <legend>页面方向</legend>
            <div class="orientation-options">
              <label><input type="radio" name="orientation" value="portrait" checked /><span class="page-icon portrait"></span><span>纵向</span></label>
              <label><input type="radio" name="orientation" value="landscape" /><span class="page-icon landscape"></span><span>横向</span></label>
            </div>
          </fieldset>

          <fieldset class="control-group">
            <legend>页面边距</legend>
            <div class="segmented" id="margin">
              <button type="button" data-value="0">无</button>
              <button type="button" class="active" data-value="10">窄</button>
              <button type="button" data-value="20">宽</button>
            </div>
          </fieldset>

          <div class="control-group quality-control">
            <label class="field-label range-label" for="imageQuality"><span>图像质量</span><output id="qualityValue" for="imageQuality">100% · 原图</output></label>
            <input id="imageQuality" class="quality-range" type="range" min="0" max="100" step="5" value="100" aria-describedby="qualityHints" />
            <div id="qualityHints" class="range-hints"><span>最低</span><span>保持原图</span></div>
          </div>
        </div>
        <div class="generate-row">
          <div id="status" class="status" role="status" aria-live="polite"></div>
          <button id="convertBtn" class="convert-button" type="button" disabled>
            <span class="button-label">生成 PDF</span>${icons.arrow}
          </button>
        </div>
      </section>

      <section class="workspace-main" aria-label="图片顺序">
        <div class="section-heading">
          <div><span class="section-kicker">02 · 排序</span><h2>图片顺序</h2></div>
          <button id="addMore" class="text-button" type="button">${icons.plus} 添加图片</button>
        </div>
        <div id="dropzone" class="dropzone" tabindex="0" role="button" aria-label="选择图片或拖入图片">
          <input id="fileInput" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden />
          <div class="drop-visual">
            <span class="paper paper-back"></span>
            <span class="paper paper-front">${icons.image}<i>${icons.plus}</i></span>
          </div>
          <h2>拖放图片到这里</h2>
          <p>或点击选择文件</p>
          <span class="format-label">支持 JPG、PNG、WEBP</span>
        </div>

        <div id="fileArea" class="file-area" hidden>
          <div class="file-heading">
            <p id="fileSummary"></p>
            <p class="drag-hint">拖动左侧手柄，或使用卡片上的移动按钮调整顺序</p>
          </div>
          <div id="fileList" class="file-list" aria-live="polite"></div>
          <p id="orderStatus" class="sr-only" role="status" aria-live="polite"></p>
        </div>
      </section>
    </section>
  </main>

  <footer><span>Pic2PDF</span><p>${icons.lock} 本地处理，不上传图片</p></footer>
`

const state = {
  images: [],
  pageSize: 'a4',
  margin: 10,
  imageQuality: 100,
  draggingId: null,
}

const $ = (selector) => document.querySelector(selector)
const fileInput = $('#fileInput')
const dropzone = $('#dropzone')
const fileArea = $('#fileArea')
const fileList = $('#fileList')
const convertBtn = $('#convertBtn')
const status = $('#status')

function humanSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function escapeHtml(value) {
  const el = document.createElement('span')
  el.textContent = value
  return el.innerHTML
}

async function addFiles(fileCollection) {
  const files = [...fileCollection]
  const accepted = files.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
  if (accepted.length !== files.length) showStatus('部分文件格式不支持，已自动跳过。', 'warning')

  const nextImages = await Promise.all(accepted.map((file) => new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({ id: crypto.randomUUID(), file, url, width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    image.src = url
  })))

  state.images.push(...nextImages.filter(Boolean))
  renderFiles()
}

function renderFiles() {
  const hasFiles = state.images.length > 0
  dropzone.hidden = hasFiles
  fileArea.hidden = !hasFiles
  convertBtn.disabled = !hasFiles
  $('#fileSummary').textContent = `${state.images.length} 张图片 · ${humanSize(state.images.reduce((sum, item) => sum + item.file.size, 0))}`
  fileList.innerHTML = state.images.map((item, index) => `
    <article class="file-card" data-id="${item.id}">
      <button class="grip" type="button" aria-label="拖动 ${escapeHtml(item.file.name)} 调整顺序" title="拖动调整顺序">${icons.grip}</button>
      <span class="page-number">${String(index + 1).padStart(2, '0')}</span>
      <img src="${item.url}" alt="${escapeHtml(item.file.name)} 的缩略图" />
      <div class="file-info"><strong title="${escapeHtml(item.file.name)}">${escapeHtml(item.file.name)}</strong><span>${item.width} × ${item.height} · ${humanSize(item.file.size)}</span></div>
      <div class="card-actions" aria-label="${escapeHtml(item.file.name)} 的排序操作">
        <button type="button" data-move="top" data-id="${item.id}" aria-label="移动到顶部" title="移动到顶部" ${index === 0 ? 'disabled' : ''}>${icons.moveTop}</button>
        <button type="button" data-move="up" data-id="${item.id}" aria-label="向上移动一个" title="向上移动一个" ${index === 0 ? 'disabled' : ''}>${icons.moveUp}</button>
        <button type="button" data-move="down" data-id="${item.id}" aria-label="向下移动一个" title="向下移动一个" ${index === state.images.length - 1 ? 'disabled' : ''}>${icons.moveDown}</button>
        <button type="button" data-move="bottom" data-id="${item.id}" aria-label="移动到底部" title="移动到底部" ${index === state.images.length - 1 ? 'disabled' : ''}>${icons.moveBottom}</button>
        <button class="delete-button" type="button" data-delete="${item.id}" aria-label="删除 ${escapeHtml(item.file.name)}" title="删除">${icons.trash}</button>
      </div>
    </article>
  `).join('')

  fileList.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => removeImage(button.dataset.delete)))
  fileList.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', () => moveImage(button.dataset.id, button.dataset.move)))
  bindSorting()
}

function removeImage(id) {
  const item = state.images.find((image) => image.id === id)
  if (item) URL.revokeObjectURL(item.url)
  state.images = state.images.filter((image) => image.id !== id)
  renderFiles()
}

function moveImage(id, direction) {
  const from = state.images.findIndex((item) => item.id === id)
  if (from < 0) return
  const destinations = { top: 0, up: Math.max(0, from - 1), down: Math.min(state.images.length - 1, from + 1), bottom: state.images.length - 1 }
  const to = destinations[direction]
  if (to === from || to === undefined) return
  const [moved] = state.images.splice(from, 1)
  state.images.splice(to, 0, moved)
  renderFiles()
  $('#orderStatus').textContent = `${moved.file.name} 已移动到第 ${to + 1} 页`
}

function bindSorting() {
  fileList.querySelectorAll('.grip').forEach((handle) => {
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return
      event.preventDefault()
      const card = handle.closest('.file-card')
      state.draggingId = card.dataset.id
      card.classList.add('dragging')
      document.body.classList.add('is-sorting')

      const onMove = (moveEvent) => {
        moveEvent.preventDefault()
        const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest('.file-card')
        if (!target || target === card || target.parentElement !== fileList) return
        const targetRect = target.getBoundingClientRect()
        const placeAfter = moveEvent.clientY > targetRect.top + targetRect.height / 2
        fileList.insertBefore(card, placeAfter ? target.nextSibling : target)
      }

      const onEnd = () => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onEnd)
        document.removeEventListener('pointercancel', onEnd)
        card.classList.remove('dragging')
        document.body.classList.remove('is-sorting')
        const orderedIds = [...fileList.querySelectorAll('.file-card')].map((item) => item.dataset.id)
        state.images.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
        const newIndex = state.images.findIndex((item) => item.id === state.draggingId)
        const movedName = state.images[newIndex]?.file.name
        state.draggingId = null
        renderFiles()
        if (movedName) $('#orderStatus').textContent = `${movedName} 已移动到第 ${newIndex + 1} 页`
      }

      document.addEventListener('pointermove', onMove, { passive: false })
      document.addEventListener('pointerup', onEnd, { once: true })
      document.addEventListener('pointercancel', onEnd, { once: true })
    })
  })
}

function showStatus(message, type = '') {
  status.className = `status ${type}`
  status.textContent = message
}

function readImage(item) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(item.file)
  })
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片解码失败'))
    image.src = url
  })
}

async function prepareImage(item, imageQuality) {
  const originalFormat = item.file.type === 'image/png' ? 'PNG' : item.file.type === 'image/webp' ? 'WEBP' : 'JPEG'
  if (imageQuality === 100) {
    return { data: await readImage(item), format: originalFormat }
  }

  const qualityRatio = imageQuality / 100
  const resolutionScale = 0.25 + qualityRatio * 0.75
  const jpegQuality = 0.12 + qualityRatio * 0.8
  const image = await loadImage(item.url)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(item.width * resolutionScale))
  canvas.height = Math.max(1, Math.round(item.height * resolutionScale))
  const context = canvas.getContext('2d', { alpha: false })
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = imageQuality < 35 ? 'low' : 'high'
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('图片压缩失败')), 'image/jpeg', jpegQuality)
  })
  return { data: new Uint8Array(await blob.arrayBuffer()), format: 'JPEG' }
}

async function createPdf() {
  if (!state.images.length) return
  const outputQuality = state.imageQuality
  convertBtn.disabled = true
  convertBtn.classList.add('working')
  convertBtn.querySelector('.button-label').textContent = '正在生成…'
  showStatus(`正在处理第 1 / ${state.images.length} 张图片…`)

  try {
    let pdf
    for (let i = 0; i < state.images.length; i += 1) {
      const item = state.images[i]
      const orientation = document.querySelector('[name="orientation"]:checked').value
      const isImagePage = state.pageSize === 'image'
      const pageFormat = isImagePage ? [item.width * 0.75, item.height * 0.75] : state.pageSize
      const pageOrientation = isImagePage ? (item.width > item.height ? 'landscape' : 'portrait') : orientation
      const config = { orientation: pageOrientation, unit: 'pt', format: pageFormat, compress: true }

      if (!pdf) pdf = new jsPDF(config)
      else pdf.addPage(pageFormat, pageOrientation)

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const marginPt = state.margin * 2.83465
      const availableWidth = pageWidth - marginPt * 2
      const availableHeight = pageHeight - marginPt * 2
      const scale = Math.min(availableWidth / item.width, availableHeight / item.height)
      const drawWidth = item.width * scale
      const drawHeight = item.height * scale
      const x = (pageWidth - drawWidth) / 2
      const y = (pageHeight - drawHeight) / 2
      const preparedImage = await prepareImage(item, outputQuality)
      pdf.addImage(preparedImage.data, preparedImage.format, x, y, drawWidth, drawHeight, undefined, 'MEDIUM')
      showStatus(`正在处理第 ${i + 1} / ${state.images.length} 张图片…`)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }

    const rawName = $('#fileName').value.trim().replace(/[\\/:*?"<>|]/g, '-') || '图片合集'
    pdf.save(`${rawName}.pdf`)
    showStatus(`PDF 已生成，共 ${state.images.length} 页。`, 'success')
    convertBtn.classList.add('done')
    convertBtn.querySelector('svg').outerHTML = icons.check
    setTimeout(() => {
      convertBtn.classList.remove('done')
      convertBtn.querySelector('svg').outerHTML = icons.arrow
    }, 2200)
  } catch (error) {
    console.error(error)
    showStatus('生成失败，请减少图片数量或尺寸后重试。', 'error')
  } finally {
    convertBtn.disabled = false
    convertBtn.classList.remove('working')
    convertBtn.querySelector('.button-label').textContent = '生成 PDF'
  }
}

dropzone.addEventListener('click', () => fileInput.click())
dropzone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click() }
})
fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = '' })
$('#addMore').addEventListener('click', () => fileInput.click())
;['dragenter', 'dragover'].forEach((name) => dropzone.addEventListener(name, (event) => { event.preventDefault(); dropzone.classList.add('dragover') }))
;['dragleave', 'drop'].forEach((name) => dropzone.addEventListener(name, (event) => { event.preventDefault(); dropzone.classList.remove('dragover') }))
dropzone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files))

document.querySelectorAll('.segmented').forEach((group) => group.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return
  group.querySelectorAll('button').forEach((item) => item.classList.remove('active'))
  button.classList.add('active')
  if (group.id === 'pageSize') {
    state.pageSize = button.dataset.value
    $('#orientationField').classList.toggle('disabled', state.pageSize === 'image')
  } else state.margin = Number(button.dataset.value)
}))

const qualityRange = $('#imageQuality')
const updateQuality = () => {
  state.imageQuality = Number(qualityRange.value)
  $('#qualityValue').textContent = state.imageQuality === 100 ? '100% · 原图' : `${state.imageQuality}%`
  qualityRange.style.setProperty('--range-progress', `${state.imageQuality}%`)
}
qualityRange.addEventListener('input', updateQuality)
updateQuality()

convertBtn.addEventListener('click', createPdf)
window.addEventListener('beforeunload', () => state.images.forEach((item) => URL.revokeObjectURL(item.url)))
