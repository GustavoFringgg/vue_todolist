<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
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
            v-model="signPWCheck"
            required
          />
          <!-- {{ signPWCheck }} -->
          <span v-if="signUpField.password !== signPWCheck">密碼不相同</span>
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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios, { Axios, AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const api = 'https://todolist-api.hexschool.io'

const signUpUID = ref('')
const signPWCheck = ref('')
const router = useRouter()

//註冊
const signUpField = ref({
  email: '',
  password: '',
  nickname: ''
})

const signUpPost = async () => {
  if (signUpField.value.password !== signPWCheck.value) {
    return Swal.fire({
      position: 'top',
      title: '密碼不相同',
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  if (
    !signUpField.value.email ||
    !signUpField.value.password ||
    !signUpField.value.nickname ||
    !signPWCheck.value
  ) {
    return Swal.fire({
      position: 'top',
      title: '資料不齊全',
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  try {
    const res = await axios.post(`${api}/users/sign_up`, signUpField.value)
    signUpUID.value = res.data.uid
    Swal.fire({
      position: 'top',
      title: '註冊成功，導回登入頁',
      icon: 'success',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
    router.push({ path: '/' })
  } catch (error) {
    if (error.name === 'AxiosError') {
      return Swal.fire({
        position: 'top',
        title: '用戶已存在',
        icon: 'error',
        timer: 1000,
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true
      })
    }
  }
}
</script>
