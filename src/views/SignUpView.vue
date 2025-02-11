<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" :src="logo" alt="title" /></a>
        <img class="d-m-n" :src="main" alt="here" />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            v-model="signUpField.email"
            required
          />
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signUpField.nickname"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            v-model="signUpField.password"
            required
          />
          <!-- {{ signUpField.password }} -->
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請再次輸入密碼"
            v-model="signUpField.confirmPassword"
            required
          />
          <!-- {{ signPWCheck }} -->
          <span v-if="signUpField.password !== signUpField.confirmPassword">密碼不相同</span>
          <input
            class="formControls_btnSubmit"
            type="button"
            value="註冊帳號"
            @click="signUpPost"
          />

          <RouterLink class="formControls_btnLink" to="/">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
<!-- ------------------- -->
<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import main from '/src/image/main.png'
import logo from '/src/image/logo.png'
import { useAlert } from '@/Composables/useAlert'
const { showAlert } = useAlert()
const local = 'http://localhost:3000'

const signUpUID = ref('')
const router = useRouter()

//註冊
const signUpField = ref({
  email: '',
  password: '',
  nickname: '',
  confirmPassword: ''
})

const signUpPost = async () => {
  if (signUpField.value.password !== signUpField.value.confirmPassword) {
    showAlert('密碼不相同', 'error')
  }
  if (
    !signUpField.value.email ||
    !signUpField.value.password ||
    !signUpField.value.nickname ||
    !signUpField.value.confirmPassword
  ) {
    showAlert('資料不齊全', 'error')
  }
  try {
    const res = await axios.post(`${local}/users/sign_up`, signUpField.value)
    console.log('註冊回來的res', res)
    signUpUID.value = res.data.uid
    showAlert('註冊成功，導回登入頁', 'success', 2000)
    setTimeout(() => {
      router.push({ path: '/' })
    }, 2000)
  } catch (error) {
    console.log('error', error)

    showAlert(`${error.response.data.message}`, 'error')
  }
}
</script>
