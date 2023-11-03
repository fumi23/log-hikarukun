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
    // セル要素の背景色とアドバイザリー情報を設定する
    element.style.backgroundColor = `hsla(50, 100%, 50%, ${scaled})`
    element.title = `${delta}ms (scale: ${scaled.toFixed(2)})`
  }
}

function main() {
  // DOM構築済みの表に色を付ける
  colorizeTable()
  // 表のDOM更新を監視し、変更を検知する都度再実行する
  const observer = new MutationObserver(() => { colorizeTable() })
  const target = document.querySelector('tbody')
  if (target) {
    observer.observe(target, { subtree: true, childList: true })
  }
}

main() // 拡張機能アイコンをクリックすると実行される
