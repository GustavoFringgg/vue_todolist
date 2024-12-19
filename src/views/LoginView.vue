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
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import main from '/src/image/main.png'
import logo from '/src/image/logo.png'
import { useAlert } from '@/Composables/useAlert'
const { showAlert } = useAlert()
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
    showAlert('請輸入Email', 'error')
  }
  if (!signInField.value.password) {
    showAlert('請輸入密碼', 'error')
  }
  try {
    const res = await axios.post(`${local}/users/sign_in`, signInField.value)

    signStatus.value = res.data.status
    signInToken.value = res.data.token
    showAlert(`${res.data.user.name}登入成功`, 'success')
    document.cookie = `userToken=${res.data.user.token}` //儲存cookie
    tokenCheck()
  } catch (error) {
    showAlert(`${(errMsg.value = error.response.data.message)}`, 'error')
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
  ) //讀取token

  if (!signInToken.value) {
    console.log('尚未登入')
    return
  }
  try {
    const res = await axios.get(`${local}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    })
    checkUser.value = res.data
    router.push({ path: '/todolist' })
  } catch (error) {
    console.log('tokencheckerror:', error.message)
  }
}
</script>
