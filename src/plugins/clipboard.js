import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess () {
  Vue.prototype.$notify({
    title: 'Tips',
    message: 'Copy succeeded',
    type: 'success'
  });
}

function clipboardError () {
  Vue.prototype.$notify({
    title: 'Tips',
    message: 'Copy failed',
    type: 'warning'
  });
}

export function handleClipboard (text, event, onSuccess, onError) {
  // const a = new Vue()
  // const h = a.$createElement
  event = event || {}
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    onSuccess ? onSuccess() : clipboardSuccess()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    onError ? onError() : clipboardError()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}