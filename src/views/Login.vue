<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
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

//api router
const api = 'https://todolist-api.hexschool.io'
const router = useRouter()

//sign in
const signStatus = ref()
const signInMessage = ref('')
const errMsg = ref('')
const signInToken = ref('')
const signInField = ref({
  email: '',
  password: ''
})

const signInPost = async () => {
  if (!signInField.value.email) {
    return alert('請輸入EMAIL')
  }
  if (!signInField.value.password) {
    return alert('請輸入密碼')
  }
  try {
    const res = await axios.post(`${api}/users/sign_in`, signInField.value)
    signStatus.value = res.data.status
    signInToken.value = res.data.token
    signInMessage.value = `${res.data.nickname}登入成功`
    alert(signInMessage.value)

    document.cookie = `userToken=${res.data.token}`
    tokenCheck()
  } catch (error) {
    alert((errMsg.value = error.response.data.message))
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
  const res = await axios.get(`${api}/users/checkout`, {
    headers: {
      Authorization: signInToken.value
    }
  })
  checkUser.value = res.data

  router.push({ path: '/todolist' })
}

tokenCheck()
</script>
