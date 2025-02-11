<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">載入中...</div>
    </div>
    <div id="todoListPage" class="bg-half" v-else>
      <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
        <ul>
          <li class="todo_sm">
            <a href="/vue_todolist/#/todolist"
              ><span>{{ checkUser.user.nickname }}的代辦事項</span></a
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
          <div class="todoList_list" v-if="getTodo.message">
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
                  >待處理</a
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
                <li v-for="(list, index) in getTodo.message" :key="list.id">
                  <label class="todoList_label" :for="list.id">
                    <input
                      class="todoList_input"
                      type="checkbox"
                      value="true"
                      :id="list.id"
                      v-model="list.status"
                      @click="toggleToProgress(list.id)"
                    />
                    <span>{{ list.todos }}</span>
                  </label>

                  <a href="" @click.prevent="deleteTodos(list.id)">
                    <i class="fa fa-times"></i>
                  </a>
                </li>
              </ul>
              <p>{{ todoMsg }}</p>

              <div class="todoList_statistics" v-if="!todoMsg">
                <p>{{ checkListPending.length }} 待完成項目</p>
              </div>
            </div>
            <div class="todoList_items" v-if="activeTab === 'tabnot'">
              <ul class="todoList_item">
                <li v-for="(list, index) in checkListPending" :key="list.id">
                  <label class="todoList_label" :for="list.id">
                    <input
                      class="todoList_input"
                      type="checkbox"
                      value="true"
                      :id="list.id"
                      v-model="list.status"
                      @click="toggleToCompleted(list.id)"
                    />
                    <span>{{ list.todos }}</span>
                  </label>

                  <a href="" @click.prevent="deleteTodos(list.id)">
                    <i class="fa fa-times"></i>
                  </a>
                </li>
              </ul>
              <p>{{ todoMsg }}</p>
              <div class="todoList_statistics" v-if="!todoMsg">
                <p>{{ checkListPending.length }} 個處理中項目</p>
              </div>
            </div>
            <div class="todoList_items" v-if="activeTab === 'tabok'">
              <ul class="todoList_item">
                <li v-for="list in checkListCompleted" :key="list.id">
                  <label class="todoList_label" :for="list.id">
                    <input
                      class="todoList_input"
                      type="checkbox"
                      value="true"
                      :id="list.id"
                      v-model="list.status"
                      @click="toggleStatus(list.id)"
                    />
                    <span>{{ list.todos }}</span>
                  </label>

                  <a href="" @click.prevent="deleteTodos(list.id)">
                    <i class="fa fa-times"></i>
                  </a>
                </li>
              </ul>
              <p>{{ todoMsg }}</p>
              <div class="todoList_statistics" v-if="!todoMsg">
                <p>{{ checkListCompleted.length }} 個已完成項目</p>
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
  </div>
</template>
<!-- ---------------------------------------------------------- -->
<script setup>
import axios from 'axios'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import empty from '/src/image/empty.png'
import { useAlert } from '@/Composables/useAlert'
const { showAlert } = useAlert()
const local = 'http://localhost:3000'
const signInToken = ref('')
const errMsg = ref('')
const router = useRouter()
//驗證
const checkUser = ref('')
const isLoading = ref(true) // 載入狀態

const signCheck = async () => {
  signInToken.value = document.cookie.replace(
    /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  if (!signInToken.value) {
    showAlert(`請登入`, 'error')

    router.push({ path: '/' })
  }

  try {
    const res = await axios.get(`${local}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    })

    checkUser.value = res.data
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error')

    router.push({ path: '/' })
    setTimeout(() => {
      nextTick(() => {
        location.reload()
      })
    }, 500)
  }
}

//登出
const signoutPost = async () => {
  const res = await axios.post(
    `${local}/users/sign_out`,

    {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    }
  )
  console.log('signoutPost:', res)
  document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  showAlert(`${res.data.message}`, 'success')

  signInToken.value = ''
  checkUser.value = ''
  getTodo.value = []
  router.push({ path: '/' })
}

const getTodo = ref(null)
const todoMsg = ref('')
const getTodos = async () => {
  try {
    const res = await axios.get(`${local}/todos/`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    })
    todoMsg.value = ''
    getTodo.value = res.data
    console.log(' getTodo.value', getTodo.value)
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'geterror'
  }
}

//新增
const todoField = ref('')
const newTodo = ref({
  todos: ''
})
const addTodos = async () => {
  if (!todoField.value || !todoField.value.trim()) {
    showAlert('請輸入代辦事項', 'warning')
  }
  try {
    newTodo.value.todos = todoField.value
    const res = await axios.post(`${local}/todos/`, newTodo.value, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    })
    console.log('res.data', res.data)
    todoField.value = ''
    showAlert('新增成功', 'success')
    getTodos()
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'adderror'
  }
}

const toggleToProgress = async (id) => {
  const res = await axios.patch(
    `${local}/todos/${id}/toggle`,
    { status: 'in_progress' },
    {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    }
  )
  getTodos()
}
const toggleToCompleted = async (id) => {
  const res = await axios.patch(
    `${local}/todos/${id}/toggle`,
    { status: 'completed' },
    {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    }
  )
  getTodos()
}
const toggleStatus = async (id) => {
  const res = await axios.patch(
    `${local}/todos/${id}/toggle`,
    {},
    {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    }
  )
  console.log(res.data)
  getTodos()
}
//刪除
const deleteTodos = async (id) => {
  try {
    const res = await axios.delete(`${local}/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`
      }
    })
  } catch (error) {
    errMsg.value = error.response?.data?.message || 'delerror'
  }
  await getTodos()
}

//分類 tab
const activeTab = ref('taball')
const selectTab = (tab) => {
  activeTab.value = tab
}

const checkListPending = computed(() => {
  return getTodo.value.message.filter((item) => item.status === false)
})

const checkListCompleted = computed(() => {
  console.log('getTodo.message', getTodo.value)
  const res = getTodo.value.message.filter((item) => item.status === true)
  console.log('ressss', res)

  return res
})

onMounted(async () => {
  try {
    await signCheck()
    if (signInToken.value) {
      await getTodos()
    } else {
      router.push({ path: '/' })
    }
  } finally {
    isLoading.value = false // 無論成功或失敗，都結束載入狀態
  }
})

// const state = ref({
//   // 每個卡片的數據
//   cards: [
//     { title: '待處理', list: [] },
//     { title: '處理中', list: [] },
//     { title: '處理完成', list: [] }
//   ]
// })

// const onStart = () => {
//   console.log('開始拖拽')
// }

// const onEnd = () => {
//   console.log('結束拖拽')
// }
</script>
