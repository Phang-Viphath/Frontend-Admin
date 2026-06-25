<template>
  <div class="flex items-center justify-center" style="height: 80vh;">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-xl text-gray-600">{{ $t('page_not_found') }}</p>
      <p class="mt-2 text-gray-500">{{ $t('page_does_not_exist') }}</p>
      <router-link to="/" class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        {{ $t('go_home') }}
      </router-link>
    </div>
  </div>
</template>