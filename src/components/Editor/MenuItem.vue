<template>
  <button
    v-b-tooltip.hover.bottom.v-secondary="tooltip"
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null }"
    :title="title"
    @click="action"
  >
    <SyncIcon :icon="icon" size="md" />
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    action: {
      type: Function,
      required: true
    },

    isActive: {
      type: Function,
      default: null
    },

    tooltip: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 28px;
  height: 28px;
  border: none;
  background-color: transparent;
  border-radius: 0.25rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &.is-active,
  &:hover {
    color: #FFF;
    background-color: $blue;
  }
}

.tooltip {
  top: 0;
}
</style>
