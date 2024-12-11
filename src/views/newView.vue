<template>
  <div class="board">
    <div v-for="(card, index) in state.cards" :key="index" class="card">
      <h3>{{ card.title }}</h3>
      <draggable
        :list="card.list"
        group="tasks"
        ghost-class="ghost"
        chosen-class="chosenClass"
        animation="300"
        @start="onStart"
        @end="onEnd"
      >
        <template #item="{ element }">
          <div class="item">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import draggable from 'vuedraggable'

const state = reactive({
  // 每個卡片的數據
  cards: [
    {
      title: '待處理',
      list: [
        { name: '任務 A', id: 0 },
        { name: '任務 B', id: 1 }
      ]
    },
    {
      title: '處理中',
      list: [{ name: '任務 C', id: 2 }]
    },
    {
      title: '處理完成',
      list: [{ name: '任務 D', id: 3 }]
    }
  ]
})

const onStart = () => {
  console.log('開始拖拽')
}

const onEnd = () => {
  console.log('結束拖拽')
}
</script>
