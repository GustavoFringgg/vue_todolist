<template>
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#"
            ><span>{{ checkUser.nickname }}的代辦事項</span></a
          >
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
              <li v-for="(list, index) in getTodo" :key="list.id">
                <label class="todoList_label" :for="list.id">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :id="list.id"
                    v-model="list.status"
                  />
                  <span>{{ list.content }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list.id)">
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
                  <span>{{ list.content }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list.id)">
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
              <li v-for="(list, index) in checkListOK" :key="list.id">
                <label class="todoList_label" :for="list.id">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :id="list.id"
                    v-model="list.status"
                  />
                  <span>{{ list.content }}</span>
                </label>

                <a href="" @click.prevent="deleteTodos(list.id)">
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
          <img
            src="https://s3-alpha-sig.figma.com/img/7465/9ab1/8911ab6dcbda98df56e26aa23c6643ac?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BmQcA76gk9l2y3s7vsRdmBkTjO8lYemchgz2fvvQqd6vEzKKoIKpTWxR5Iz6gkNQvICzQzSjfpXqRAiCmhCNaAQ6Nh7~7r0wEuxTCVOUzW8CGb7FlmUhs6GheqqJYxcxGV-lXtINwxY64LwHtFEXuKVwtdn2SiYuHNupWiTlTN77sAjR8vDZyjkSsuq4CXGVik3UGeHkJnsNAa-6eQ~QB-7HcW4F914N17QBifY47i8f~-AxsoBQ4OAmEM7uO-Jv1g1Wu7FEvy8-otCk79O2XZv6BpUsFTUyvDTR113J0ksi79QkwpeD8I6W4wZ1NxKwmvrxER6-COl7hStdVP1-QQ__"
            alt="#"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<!-- ---------------------------------------------------------- -->
<script setup>
import axios from 'axios'
import { computed, ref } from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.js'

const api = 'https://todolist-api.hexschool.io'
const signInToken = ref('')
const errMsg = ref('')

//驗證
const checkUser = ref({
  nickname: '',
  uid: ''
})

const signCheck = async () => {
  signInToken.value = document.cookie.replace(
    /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  )

  const res = await axios.get(`${api}/users/checkout`, {
    headers: {
      Authorization: signInToken.value
    }
  })
  checkUser.value = res.data
  getTodos()
}
signCheck()

//登出
const signOutCheck = ref('')
const signoutPost = async () => {
  const res = await axios.post(
    `${api}/users/sign_out`,
    {},
    {
      headers: {
        Authorization: signInToken.value
      }
    }
  )
  document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  signOutCheck.value = '已登出'
  Swal.fire({
    position: 'top',
    title: `${signOutCheck.value}`,
    icon: 'success',
    timer: 1000,
    toast: true,
    showConfirmButton: false,
    timerProgressBar: true
  })
  checkUser.value.uid = ''
}

const getTodo = ref([])
const todoMsg = ref('')
const getTodos = async () => {
  try {
    const res = await axios.get(`${api}/todos/`, {
      headers: {
        Authorization: signInToken.value
      }
    })
    todoMsg.value = ''
    res.data.data.forEach((item) => {
      const createTime = item.createTime
      const date = new Date(createTime * 1000)
      const formate = date.toISOString().slice(0, 19).replace('T', ' ')
      item.createTime = formate
    })
    getTodo.value = res.data.data
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'geterror'
  }
}

getTodos()

//新增
const todoField = ref('')
const newTodo = ref({
  content: ''
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
    newTodo.value.content = todoField.value
    const res = await axios.post(`${api}/todos/`, newTodo.value, {
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
    const res = await axios.delete(`${api}/todos/${id}`, {
      headers: {
        Authorization: signInToken.value
      }
    })

    getTodos()
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'delerror'
  }
}

//分類 tab
const activeTab = ref('taball')
const selectTab = (tab) => {
  activeTab.value = tab
}

//未完成
const checkListNot = computed(() => {
  return getTodo.value.filter((item) => item.status === false)
})

//已完成
const checkListOK = computed(() => {
  return getTodo.value.filter((item) => item.status === true)
})
</script>
