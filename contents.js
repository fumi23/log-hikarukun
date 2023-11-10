function *generator() {
  // 表の行番号(#)を除く最初の列をタイムスタンプ列とみなす
  const timestampCells = document.querySelectorAll('tbody tr td:nth-of-type(2)')
  let prevTimestamp = NaN
  for (const timestampCell of timestampCells.values()) {
    // 表のセル内の文字列が ISO 8601 形式であることを期待している
    const currentTimestamp = Date.parse(timestampCell.textContent)
    yield [timestampCell, currentTimestamp - prevTimestamp]
    prevTimestamp = currentTimestamp
  }
}

function colorizeTable() {
  // element: タイムスタンプが記載されている表のセル要素
  // delta: 直前行のタイムスタンプからの増分（単位は ms, 最初はNaN）
  for (const [element, delta] of generator()) {
    // deltaの値 [0, 1023] を対数スケールで [0, 1] に変換する
    const scaled = Math.log1p(delta) / Math.log(1024)
    // セル要素をハイライトする（強弱は背景色のアルファ値で表現）
    element.style.backgroundColor = `hsla(50, 100%, 50%, ${scaled})`
    element.title = `${delta}ms (scale: ${scaled.toFixed(2)})`
  }
}

function main() {
  // 表がある閲覧コンテキストでのみ処理を続行
  const target = document.querySelector('tbody')
  if (!target) return
  // DOM構築済みの表に色を付ける
  colorizeTable()
  // 表のDOM更新を監視し、変更を検知する都度再実行する
  const observer = new MutationObserver(() => { colorizeTable() })
  observer.observe(target, { subtree: true, childList: true })
}

main() // 拡張機能アイコンをクリックすると各閲覧コンテキストで実行される
