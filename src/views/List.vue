<template>
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="/vue_todolist/#/todolist"
            ><span>{{ checkUser.user.nickname }}的代辦事項</span></a
          >
          <!-- <a @click="signoutPost">登出</a> -->
          <RouterLink to="/" @click="signoutPost">登出</RouterLink>
        </li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="todoField" />
          <a href="" @click.prevent="addTodos(todoField)">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list" v-if="getTodo.length !== 0">
          <ul class="todoList_tab">
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'taball' }"
                @click.prevent="selectTab('taball')"
                >全部</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'tabnot' }"
                @click.prevent="selectTab('tabnot')"
                >待完成</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'tabok' }"
                @click.prevent="selectTab('tabok')"
                >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items" v-if="activeTab === 'taball'">
            <ul class="todoList_item">
              <li v-for="(list, index) in getTodo" :key="index">
                <label class="todoList_label" :for="list._id">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :id="list._id"
                    v-model="list.status"
                  />

                  <span>{{ list.todos }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list._id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <p>{{ todoMsg }}</p>
            <div class="todoList_statistics" v-if="!todoMsg">
              <p>{{ checkListNot.length }} 個待完成項目</p>
            </div>
          </div>
          <div class="todoList_items" v-if="activeTab === 'tabnot'">
            <ul class="todoList_item">
              <li v-for="(list, index) in checkListNot" :key="list.id">
                <label class="todoList_label" :for="list.id">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :id="list.id"
                    v-model="list.status"
                  />
                  <span>{{ list.todos }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list._id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <p>{{ todoMsg }}</p>
            <div class="todoList_statistics" v-if="!todoMsg">
              <p>{{ checkListNot.length }} 個待完成項目</p>
            </div>
          </div>
          <div class="todoList_items" v-if="activeTab === 'tabok'">
            <ul class="todoList_item">
              <li v-for="list in checkListOK" :key="list.id">
                <label class="todoList_label" :for="list.id">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :id="list.id"
                    v-model="list.status"
                  />
                  <span>{{ list.todos }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list._id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <p>{{ todoMsg }}</p>
            <div class="todoList_statistics" v-if="!todoMsg">
              <p>{{ checkListOK.length }} 個已完成項目</p>
            </div>
          </div>
        </div>
        <div style="text-align: center" v-else>
          <h2>目前尚無待辦事項</h2>
          <img :src="empty" alt="#" />
        </div>
      </div>
    </div>
  </div>
</template>
<!-- ---------------------------------------------------------- -->
<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useRouter } from 'vue-router'
import empty from '/src/image/empty.png'
const api = 'https://todolist-api.hexschool.io'
const local = 'http://localhost:3000'
const signInToken = ref('')
const errMsg = ref('')
const router = useRouter()
//驗證
const checkUser = ref('')

const signCheck = async () => {
  signInToken.value = document.cookie.replace(
    /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  if (!signInToken.value) {
    Swal.fire({
      position: 'top',
      title: `請登入`,
      icon: 'error',
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
    router.push({ path: '/' })
  }

  try {
    const res = await axios.get(`${local}/users/checkout`, {
      headers: {
        Authorization: signInToken.value
      }
    })

    checkUser.value = res.data
    getTodos()
  } catch (error) {
    Swal.fire({
      position: 'top',
      title: error.response.data.message,
      icon: 'error',
      timer: 500,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
    router.push({ path: '/' })
  }
}
signCheck()

//登出

const signoutPost = async () => {
  const res = await axios.post(`${local}/users/sign_out`, {
    headers: {
      Authorization: signInToken.value
    }
  })
  console.log('signoutPost:', res)
  document.cookie = 'userToken='
  Swal.fire({
    position: 'top',
    title: `${res.data.message}`,
    icon: 'success',
    timer: 1000,
    toast: true,
    showConfirmButton: false,
    timerProgressBar: true
  })
  checkUser.value = ''
  router.push({ path: '/' })
}

const getTodo = ref([])
const todoMsg = ref('')
const getTodos = async () => {
  try {
    const res = await axios.get(`${local}/todos/`, {
      headers: {
        Authorization: signInToken.value
      }
    })
    console.log('getTodo:', res)
    todoMsg.value = ''
    // res.data.data.forEach((item) => {
    //   const createTime = item.createTime
    //   const date = new Date(createTime * 1000)
    //   const formate = date.toISOString().slice(0, 19).replace('T', ' ')
    //   item.createTime = formate
    // })

    getTodo.value = res.data.message
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'geterror'
  }
}

getTodos()

//新增
const todoField = ref('')
const newTodo = ref({
  todos: ''
})
const addTodos = async () => {
  if (!todoField.value || !todoField.value.trim()) {
    return Swal.fire({
      position: 'top',
      title: '請輸入代辦事項',
      icon: 'warning',
      timer: 500,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  try {
    newTodo.value.todos = todoField.value
    const res = await axios.post(`${local}/todos/`, newTodo.value, {
      headers: {
        Authorization: signInToken.value
      }
    })

    todoField.value = ''
    Swal.fire({
      position: 'top',
      title: '新增成功',
      icon: 'success',
      timer: 500,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true
    })

    getTodos()
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'adderror'
  }
}

//刪除
const deleteTodos = async (id) => {
  try {
    const res = await axios.delete(`${local}/todos/${id}`, {
      headers: {
        Authorization: signInToken.value
      }
    })

    await getTodos()
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'delerror'
  }
}

//分類 tab
const activeTab = ref('taball')
const selectTab = (tab) => {
  activeTab.value = tab
}

// //未完成
const checkListNot = computed(() => {
  return getTodo.value.filter((item) => item.status === false)
})

//已完成
const checkListOK = computed(() => {
  return getTodo.value.filter((item) => item.status === true)
})

onMounted(async () => {
  await getTodos()
})
</script>
