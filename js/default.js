let vm = null
let vue = new Vue({
    el: '#app',
    directives: {
		typed: vueTyped
	},
    data: {
        topNav: '介绍',
        inMain: true,
        inIntroduce: false,
        inLogin: false,
        inRegister: false,
        ruleForm: {
        username: '',
        password: '',
        confirmPassword: '',
        },

        registerType: false,
        rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
            min: 5,
            max: 16,
            message: '长度在 5 到 16 个字符',
            trigger: 'blur',
            },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur',
            },
        ],
        confirmPassword: [
            {
            validator: function (rule, value, callback) {
                console.log(this)
                if (value === '') {
                callback(new Error('请再次输入密码'))
                } else if (value !== vm.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'))
                } else {
                callback()
                }
            },
            trigger: 'blur',
            },
        ],
        },
    },
    created: function() {
        vm = this
    },
    methods: {
        switchTo() {
        if (this.inMain) {
            this.inIntroduce = true
            this.inMain = false
            this.inLogin = false
            this.inRegister = false
            this.topNav = '主页'
        } else {
            this.inIntroduce = false
            this.inMain = true
            this.inLogin = false
            this.inRegister = false
            this.topNav = '介绍'
        }
        },
        toLogin() {
            this.inIntroduce = false
            this.inMain = false
            this.inLogin = true
            this.inRegister = false
            this.topNav = '主页'
        },
        toRegister() {
            this.inIntroduce = false
            this.inMain = false
            this.inLogin = true
            this.inRegister = true
            this.topNav = '主页'
        },
        toMyBlog() {
            window.open('https://wyatex.gitee.io')
        },
        reset() {
            this.$refs['form'].resetFields()
        },
    },
})

let SEPARATION = 100,
AMOUNTX = 50,
AMOUNTY = 50

let container
let camera, scene, renderer

let particles,
particle,
count = 0

let mouseX = 0,
mouseY = 0

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

function onWindowResize() {
windowHalfX = window.innerWidth / 2
windowHalfY = window.innerHeight / 2
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove(event) {
mouseX = event.clientX - windowHalfX
mouseY = event.clientY - windowHalfY
}

function onDocumentTouchStart(event) {
if (event.touches.length === 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
}
}

function onDocumentTouchMove(event) {
if (event.touches.length === 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
}
}

function animate() {
requestAnimationFrame(animate)
render()
}

function render() {
camera.position.x += (mouseX - camera.position.x) * 0.05
camera.position.y += (-mouseY - camera.position.y) * 0.05
camera.lookAt(scene.position)
var i = 0
for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
    particle = particles[i++]
    particle.position.y =
        Math.sin((ix + count) * 0.3) * 50 +
        Math.sin((iy + count) * 0.5) * 50
    particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 1) * 2 +
        (Math.sin((iy + count) * 0.5) + 1) * 2
    }
}
renderer.render(scene, camera)
count += 0.1
}

function init(dom) {
container = dom
camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
)
camera.position.z = 1000
scene = new THREE.Scene()
particles = new Array()
var PI2 = Math.PI * 2
var material = new THREE.ParticleCanvasMaterial({
    color: '#999',
    program: function (context) {
    context.beginPath()
    context.arc(0, 0, 1, 0, PI2, true)
    context.fill()
    },
})
var i = 0
for (var ix = 0; ix < AMOUNTX; ix++) {
    for (var iy = 0; iy < AMOUNTY; iy++) {
    particle = particles[i++] = new THREE.Particle(material)
    particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
    particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
    scene.add(particle)
    }
}
renderer = new THREE.CanvasRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)
document.addEventListener('mousemove', onDocumentMouseMove, false)
document.addEventListener('touchstart', onDocumentTouchStart, false)
document.addEventListener('touchmove', onDocumentTouchMove, false)
window.addEventListener('resize', onWindowResize, false)
}

let renderAnimation = (container) => {
init(container)
animate()
}
let domContainer = document.getElementById('bg')
renderAnimation(domContainer)


function stopAnimation() {
document.body.removeChild(document.getElementById('bg'))
}