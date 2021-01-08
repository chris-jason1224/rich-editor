import { Quill } from 'vue-quill-editor'
// 引入源码中的BlockEmbed
const BlockEmbed = Quill.import('blots/block/embed')

// 定义新的blot类型
class DivBlot extends BlockEmbed {
  static create (value) {
    const node = super.create(value)
    node.setAttribute('contenteditable', 'true')
    node.setAttribute('width', '100%')
    //   设置自定义html
    node.innerHTML = this.transformValue(value)
    return node
  }

  static transformValue (value) {
    let handleArr = value.split('\n')
    handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
      .replace(/[\s]+$/, ''))
    return handleArr.join('')

    // return value
  }

  // 返回节点自身的value值 用于撤销操作
  static value (node) {
    return node.innerHTML
  }
}

// blotName
DivBlot.blotName = 'DivBlot'
// class名将用于匹配blot名称
DivBlot.className = 'embed-innerApp'
// 标签类型自定义
DivBlot.tagName = 'div'
Quill.register(DivBlot, true)

export default DivBlot
