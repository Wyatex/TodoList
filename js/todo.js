let vue = new Vue({
  el: '#app',
  data: {
    isCollapse: true,                       // 是否收起菜单
    menuBtnStatus: '展开菜单',              // 展开或收起菜单按钮文字
    isAutoSave: true,                       // 是否自动保存
    inAdding: false,                        // 是否在添加项目界面
    inTodo: true,                           // 是否在项目todo界面
    inSetting: false,                       // 是否在设置界面
    inEditItem: false,                      // 是否在编辑item
    currentProject: 0,                      // 当前项目序号
    newTodo: '',                            // 新item内容
    newColumnName: '',                      // 新栏名称
    columnEditingIndex: 0,                  // 编辑栏时栏的序号
    dialogAddColumnVisible: false,          // 是否打开创建新栏对话框
    dialogEditColumnVisible: false,         // 是否打开编辑栏对话框
    dialogEditTemplateVisible: false,       // 是否打开编辑模板对话框
    dialogAddTemplateVisible: false,        // 是否打开添加模板对话框
    drawerEditItemVisible: false,           // 是否打开item编辑界面
    isEditProjectTitle: false,              // 是否打开项目编辑气泡框
    editProject: {                          // 编辑项目的信息
      name: '',
      desc: '',
    },
    itemEditingIndex: {                     // 编辑item时栏和item的序号
      colIndex: 0,
      itemIndex: 0,
    },
    templateEditingIndex: 0,                // 编辑模板的序号
    projectForm: {                          // 新建项目的信息
      name: '',
      desc: '',
      template: '',
    },
    templateForm: {                         // 修改或创建模板的信息
      value: '',                            // 模板的值（用于创建项目时选择）
      label: '',                            // 模板名称
      desc: '',                             // 模板描述
      columns: [],                          // 模板默认用于的栏
    },
    projects: [],                           // 所有的项目信息
    template: [],                           // 项目模板
  },

  created() {
    // 加载项目
    let projects = localStorage.getItem('projects')
    if (projects === null) {
      this.initProjects()
    } else {
      this.projects = JSON.parse(projects)
    }
    // 加载模板
    let template = localStorage.getItem('template')
    if (template === null) {
      this.initTemplate()
    } else {
      this.template = JSON.parse(template)
    }
    // 是否自动保存
    let isAutoSave = localStorage.getItem('autoSave')
    console.log(isAutoSave)
    if (isAutoSave === null) {
      this.isAutoSave = true
    } else {
      this.isAutoSave = JSON.parse(isAutoSave)
    }
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
    initProjects() {
      this.projects = [
        {
          name: '默认项目',
          desc: '这是默认创建的项目，可以点击右边的修改按钮进行修改',
          columns: [
            {
              name: '代办事项',
              inAdding: false,
              item: [
                '点击添加项添加代办事项到本栏',
                '鼠标放到添加项旁边的箭头，打开下拉菜单，可以修改栏名称、清空本栏、删除本栏',
              ],
            },
            {
              name: '进行中',
              inAdding: false,
              item: [
                '长按卡片可以拖动到其他的栏',
                '点击右边的垃圾桶按钮可以删除项',
                '双击文字对项内容进行修改'
              ],
            },
            {
              name: '已完成',
              inAdding: false,
              item: [
                '点击上方的修改项目信息可对项目的名称、简介进行修改'
              ],
            },
          ],
        },
      ]
    },
    initTemplate() {
      this.template = [
        {
          value: 'blank',
          label: '空白看板',
          desc: '从一个完全空白的项目板开始，您可以自己添加列和进行设置。',
          columns: [],
        },
        {
          value: 'basic',
          label: '基本的看板',
          desc: '基本的看板：选择这个模板，将会默认添加：”代办事项“、”进行中“和“完成”三列。',
          columns: ['代办事项', '进行中', '完成'],
        },
      ]
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

      // 判断是否存在该项目
      let ifExist = false
      this.projects.some(project => {
        if (this.projectForm.name === project.name) {
          ifExist = true
          return true
        }
      })
      if (ifExist) {
        ELEMENT.Message({
          message: '已存在同名项目',
          type: 'error',
        })
        return
      }

      this.projects.push({
        name: this.projectForm.name,
        desc: this.projectForm.desc,
        columns: [],
      })

      // 将模板的栏加入项目
      let template = {}
      this.template.some(item => {
        if (item.value === this.projectForm.template) {
          template = item
        }
      })
      template.columns.forEach(item => {
        this.projects[this.projects.length - 1].columns.push({
          name: item,
          inAdding: false,
          item: [],
        })
      })

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
      // 如果只剩下一个项目不允许删除
      if (this.projects.length === 1) {
        ELEMENT.Message({
          message: '这是最后一个项目，不允许删除，请添加新的再删除本项目',
          type: 'error',
        })
        return
      }
      this.projects.splice(index, 1)
      ELEMENT.Message({
        message: '删除成功',
        type: 'success',
      })
    },
    toAddItem(index) {
      this.projects[this.currentProject].columns[index].inAdding = true
    },
    addColumn() {
      if (this.newColumnName === '') {
        ELEMENT.Message({
          message: '请先输入栏名称再添加',
          type: 'error',
        })
        return
      }
      this.projects[this.currentProject].columns.push({
        name: this.newColumnName,
        inAdding: false,
        item: [],
      })
      this.newColumnName = ''
      this.dialogAddColumnVisible = false

      this.autoSava()
    },
    delCol(colIndex) {
      let name = this.projects[this.currentProject].columns[colIndex].name
      this.projects[this.currentProject].columns.splice(colIndex, 1)
      ELEMENT.Message({
        message: `栏目 ${name} 删除成功`,
        type: 'success',
      })

      this.autoSava()
    },
    clearCol(colIndex) {
      let name = this.projects[this.currentProject].columns[colIndex].name
      this.projects[this.currentProject].columns[colIndex].item = []
      ELEMENT.Message({
        message: `栏目 ${name} 清空成功`,
        type: 'success',
      })

      this.autoSava()
    },
    openEditCol(colIndex) {
      this.newColumnName = this.projects[this.currentProject].columns[colIndex].name
      this.dialogEditColumnVisible = true
      this.columnEditingIndex = colIndex
    },
    editCol() {
      this.projects[this.currentProject].columns[this.columnEditingIndex].name = this.newColumnName
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
      this.projects[this.currentProject].columns[index].item.push(this.newTodo)
      this.projects[this.currentProject].columns[index].inAdding = false
      this.newTodo = ''

      this.autoSava()
    },
    delItem(colIndex, itemIndex) {
      this.projects[this.currentProject].columns[colIndex].item.splice(
        itemIndex,
        1
      )

      this.autoSava()
    },
    openEditItem(colIndex,itemIndex) {
      this.itemEditingIndex.colIndex = colIndex
      this.itemEditingIndex.itemIndex = itemIndex
      this.newTodo = this.projects[this.currentProject].columns[colIndex].item[itemIndex]
      this.drawerEditItemVisible = true
    },
    editItem() {
      this.projects[this.currentProject].columns[this.itemEditingIndex.colIndex].item[this.itemEditingIndex.itemIndex] = this.newTodo
      this.drawerEditItemVisible = false

      this.autoSava()
    },
    afterDragItem() {
      this.autoSava()
    },
    addTemplate() {
      this.template.push(this.templateForm)
      this.dialogAddTemplateVisible = false
    },
    openAddTemplate() {
      this.templateForm = {
        value: '',
        label: '',
        desc: '',
        columns: [],
      }
      this.dialogAddTemplateVisible = true
    },
    delTemplate(index) {
      // 判断是否只剩下一个模板，如果是禁止删除
      let templateHasOnlyOne = false
      this.template.length === 1 ? templateHasOnlyOne = true : templateHasOnlyOne = false
      if (templateHasOnlyOne) {
        ELEMENT.Message({
          message: '不能删除最后一个模板',
          type: 'error',
        })
        return
      }
      this.template.splice(index, 1)
    },
    editTemplate() {
      // 判断是否有空的栏名字
      let hasEmptyName = false
      for (let index = 0; index < this.templateForm.columns.length; index++) {
        const element = this.templateForm.columns[index];
        if (element === '') {
          hasEmptyName = true
          break
        }
      }
      if (hasEmptyName) {
        ELEMENT.Message({
          message: '禁止使用空的栏名字',
          type: 'error',
        })
        return
      }

      this.template[this.templateEditingIndex].value = this.templateForm.value
      this.template[this.templateEditingIndex].label = this.templateForm.label
      this.template[this.templateEditingIndex].desc = this.templateForm.desc
      this.template[this.templateEditingIndex].columns = [...this.templateForm.columns]
      ELEMENT.Message({
        message: '修改模板成功',
        type: 'success',
      })
      this.dialogEditTemplateVisible = false
      this.autoSava()
    },
    removeColumnInTemplateForm(index) {
      this.templateForm.columns.splice(index, 1)
    },
    openEditTemplate(index) {
      this.templateEditingIndex = index
      this.templateForm.value = this.template[index].value
      this.templateForm.desc = this.template[index].desc
      this.templateForm.label = this.template[index].label
      this.templateForm.columns = [...this.template[index].columns]
      this.dialogEditTemplateVisible = true
    },
    saveData() {
      setTimeout(() => {
        let dataString = JSON.stringify(this.projects)
        localStorage.setItem('projects', dataString)
        dataString = JSON.stringify(this.template)
        localStorage.setItem('template', dataString)
        localStorage.setItem('autoSave', this.isAutoSave.toString())
        ELEMENT.Message({
          message: '保存成功',
          type: 'success',
        })
      }, 200)
    },
    clearData() {
      localStorage.removeItem('projects')
      localStorage.removeItem('template')
      localStorage.removeItem('autoSave')
      ELEMENT.Message({
        message: '初始化成功',
        type: 'success',
      })
      location.reload()
    },
    switchAutoSave() {
      localStorage.setItem('autoSave', this.isAutoSave.toString())
    },
    async autoSava() {
      // 根据设置判断是否自动保存
      if (this.isAutoSave) {
        this.saveData()
      }
    },
  },

})
