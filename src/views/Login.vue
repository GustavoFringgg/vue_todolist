<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" :src="logo" alt="title" /></a>
        <img class="d-m-n" :src="main" alt="here" />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            v-model="signInField.email"
            required
          />
          <span v-if="signInField.password && !signInField.email">email尚未輸入</span>

          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            v-model="signInField.password"
            required
          />
          <span v-if="signInField.email && !signInField.password">密碼尚未輸入</span>

          <input class="formControls_btnSubmit" type="button" @click="signInPost" value="登入" />
          <RouterLink class="formControls_btnLink" to="/signup">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
<!-- -------------------------- -->
<script setup>
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import main from '/src/image/main.png'
import logo from '/src/image/logo.png'
//api router

const local = 'http://localhost:3000'
const router = useRouter()

//sign in
const signStatus = ref()
const errMsg = ref('')
const signInToken = ref('')
const signInField = ref({
  email: '',
  password: ''
})

const signInPost = async () => {
  if (!signInField.value.email) {
    return Swal.fire({
      position: 'top',
      title: '請輸入Email',
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  if (!signInField.value.password) {
    return Swal.fire({
      position: 'top',
      title: '請輸入密碼',
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  try {
    const res = await axios.post(`${local}/users/sign_in`, signInField.value)

    signStatus.value = res.data.status
    signInToken.value = res.data.token
    Swal.fire({
      position: 'top',
      title: `${res.data.user.name}登入成功`,
      icon: 'success',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })

    document.cookie = `userToken=${res.data.user.token}`
    tokenCheck()
  } catch (error) {
    Swal.fire({
      position: 'top',
      title: `${(errMsg.value = error.response.data.message)}`,
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
}

//驗證
const checkUser = ref({
  nickname: '',
  uid: ''
})

const tokenCheck = async () => {
  signInToken.value = document.cookie.replace(
    /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  )

  if (!signInToken.value) {
    console.log('尚未登入')
    return
  }
  try {
    const res = await axios.get(`${local}/users/checkout`, {
      headers: {
        Authorization: signInToken.value
      }
    })
    checkUser.value = res.data

    router.push({ path: '/todolist' })
  } catch (error) {
    console.log('tokencheckerror:', error)
  }
}

// tokenCheck()
</script>
