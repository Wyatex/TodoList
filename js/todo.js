let vue = new Vue({
  el: '#app',
  data: {
    isCollapse: true,                       // 是否收起菜单
    menuBtnStatus: '展开菜单',              // 展开或收起菜单按钮文字
    isAutoSave: true,                      // 是否自动保存
    inAdding: false,                        // 是否在添加项目界面
    inTodo: true,                           // 是否在项目todo界面
    inSetting: false,                       // 是否在设置界面
    inEditItem: false,                      // 是否在编辑item
    currentProject: 0,                      // 当前项目序号
    newTodo: '',                            // 新item内容
    newColumnName: '',                      // 新栏名称
    columnEditingIndex: 0,                  // 编辑栏时栏的序号
    itemEditingIndex: {                     // 编辑item时栏和item的序号
      colIndex: 0,
      itemIndex: 0,
    },
    dialogAddColumnVisible: false,          // 是否打开创建新栏对话框
    dialogEditColumnVisible: false,         // 是否打开编辑栏对话框
    drawerEditItemVisible: false,           // 是否打开item编辑界面
    isEditProjectTitle: false,              // 是否打开项目编辑气泡框
    editProject: {                          // 编辑项目的信息
      name: '',
      desc: '',
    },
    projectTemplate: [                      // 项目模板
      {
        value: 'blank',
        label: '空白看板',
        desc: '从一个完全空白的项目板开始，您可以自己添加列和进行设置。',
        column: [],
      },
      {
        value: 'basic',
        label: '基本的看板',
        desc: '基本的看板：选择这个模板，将会默认添加：”代办事项“、”进行中“和“完成”三列。',
        column: ['代办事项', '进行中', '完成'],
      },
    ],
    projectForm: {                          // 新建项目的信息
      name: '',
      desc: '',
      template: '',
    },
    projects: [],                           // 所有的项目信息
  },

  created() {
    let data = localStorage.getItem('data')
    if (data === null) {
      this.projects = [
        {
          name: '默认项目',
          desc: 'blahblahblah...',
          info: [
            {
              column: '代办事项',
              inAdding: false,
              item: [
                '点击添加项添加代办事项到本栏',
                '鼠标放到添加项旁边的箭头，打开下拉菜单，可以修改栏名称、清空本栏、删除本栏',
              ],
            },
            {
              column: '进行中',
              inAdding: false,
              item: [
                '长按卡片可以拖动到其他的栏',
                '点击右边的垃圾桶按钮可以删除项',
                '双击文字对项内容进行修改'
              ],
            },
            {
              column: '已完成',
              inAdding: false,
              item: [
                '点击上方的修改项目信息可对项目的名称、简介进行修改'
              ],
            },
          ],
        },
      ]
      return
    }
    this.projects = JSON.parse(data)
  },

  methods: {
    collapse() {
      if (this.isCollapse === true) {
        this.isCollapse = false
        this.menuBtnStatus = '收起菜单'
      } else {
        this.isCollapse = true
        this.menuBtnStatus = '展开菜单'
      }
    },
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.inAdding = true
        this.inTodo = false
        this.inSetting = false
      } else if (key === '3') {
        this.inAdding = false
        this.inTodo = false
        this.inSetting = true
      } else if (key.substring(0, 1) === '2') {
        this.currentProject = Number(key.substring(2)) - 1
        this.inAdding = false
        this.inTodo = true
        this.inSetting = false
      }
    },
    addProject() {
      if (this.projectForm.name === '') {
        ELEMENT.Message({
          message: '请先输入项目面板名再添加',
          type: 'error',
        })
        return
      } else if (this.projectForm.template === '') {
        ELEMENT.Message({
          message: '请先选择一个模板再添加',
          type: 'error',
        })
        return
      }
      if (this.projectForm.template === 'basic') {
        this.projects.push({
          name: this.projectForm.name,
          desc: this.projectForm.desc,
          info: [
            {
              column: '代办事项',
              inAdding: false,
              item: [],
            },
            {
              column: '进行中',
              inAdding: false,
              item: [],
            },
            {
              column: '已完成',
              inAdding: false,
              item: [],
            },
          ],
        })
      } else if (this.projectForm.template === 'blank') {
        this.projects.push({
          name: this.projectForm.name,
          desc: this.projectForm.desc,
          info: [],
        })
      }
      this.projectForm = {
        name: '',
        desc: '',
        template: '',
      }
      this.handleSelect('2-' + this.projects.length)

      this.autoSava()
    },
    openEditProjectTile() {
      this.editProject.name = this.projects[this.currentProject].name
      this.editProject.desc = this.projects[this.currentProject].desc
    },
    editProjectTile() {
      this.projects[this.currentProject].name = this.editProject.name
      this.projects[this.currentProject].desc = this.editProject.desc
      this.isEditProjectTitle = false

      this.autoSava()
    },
    delProject(index) {
      //todo
    },
    toAddItem(index) {
      this.projects[this.currentProject].info[index].inAdding = true
    },
    addColumn() {
      if (this.newColumnName === '') {
        ELEMENT.Message({
          message: '请先输入栏名称再添加',
          type: 'error',
        })
        return
      }
      this.projects[this.currentProject].info.push({
        column: this.newColumnName,
        inAdding: false,
        item: [],
      })
      this.newColumnName = ''
      this.dialogAddColumnVisible = false

      this.autoSava()
    },
    delCol(colIndex) {
      let name = this.projects[this.currentProject].info[colIndex].column
      this.projects[this.currentProject].info.splice(colIndex, 1)
      ELEMENT.Message({
        message: `栏目 ${name} 删除成功`,
        type: 'success',
      })

      this.autoSava()
    },
    clearCol(colIndex) {
      let name = this.projects[this.currentProject].info[colIndex].column
      this.projects[this.currentProject].info[colIndex].item = []
      ELEMENT.Message({
        message: `栏目 ${name} 清空成功`,
        type: 'success',
      })

      this.autoSava()
    },
    openEditCol(colIndex) {
      this.newColumnName = this.projects[this.currentProject].info[colIndex].column
      this.dialogEditColumnVisible = true
      this.columnEditingIndex = colIndex
    },
    editCol() {
      this.projects[this.currentProject].info[this.columnEditingIndex].column = this.newColumnName
      this.newColumnName = ''
      this.dialogEditColumnVisible = false

      this.autoSava()
    },
    addItem(index) {
      if (this.newTodo === '') {
        ELEMENT.Message({
          message: '请先输入内容再添加',
          type: 'error',
        })
        return
      }
      this.projects[this.currentProject].info[index].item.push(this.newTodo)
      this.projects[this.currentProject].info[index].inAdding = false
      this.newTodo = ''

      this.autoSava()
    },
    delItem(colIndex, itemIndex) {
      this.projects[this.currentProject].info[colIndex].item.splice(
        itemIndex,
        1
      )

      this.autoSava()
    },
    openEditItem(colIndex,itemIndex) {
      this.itemEditingIndex.colIndex = colIndex
      this.itemEditingIndex.itemIndex = itemIndex
      this.newTodo = this.projects[this.currentProject].info[colIndex].item[itemIndex]
      this.drawerEditItemVisible = true
    },
    editItem() {
      this.projects[this.currentProject].info[this.itemEditingIndex.colIndex].item[this.itemEditingIndex.itemIndex] = this.newTodo
      this.drawerEditItemVisible = false

      this.autoSava()
    },
    afterDragItem() {
      this.autoSava()
    },
    logData() {
      console.log(this.projects)
    },
    saveData() {
      let dataString = JSON.stringify(this.projects)
      localStorage.setItem('data', dataString)
      ELEMENT.Message({
        message: '保存成功',
        type: 'success',
      })
    },
    async autoSava() {
      // 根据设置判断是否自动保存
      if (this.isAutoSave) {
        this.saveData()
      }
    },
  },

})
