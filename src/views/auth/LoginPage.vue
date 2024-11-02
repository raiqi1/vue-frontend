<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import Error from '@/components/Error.vue'
import { loginInput, useLoginUser } from './actions/LoginUser'
import BaseBtn from '@/components/BaseBtn.vue'


const rules = {
  email: { required, email },
  password: { required },
}

const v$ = useVuelidate(rules, loginInput.value)
const { loading, loginUser: performLogin } = useLoginUser()

async function submitLogin() {
  const result = await v$.value.$validate()

  if (!result) {
    return
  }
  await performLogin()

}

function goHome() {
  window.location.href = '/'
}
</script>
<template>
  <div class="row">
    <div class="row">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <div class="card">
          <!-- {{ registerInput }} -->
          <div class="card-body">
            <h2 align="center">Login</h2>
            <form action="" @submit.prevent="submitLogin">
              <Error label="Email" :errors="v$.email.$errors">
                <input v-model="loginInput.email" class="form-control form-control-lg" />
              </Error>

              <Error label="Password" :errors="v$.password.$errors">
                <input type="password" v-model="loginInput.password" class="form-control form-control-lg" />
              </Error>
              <br />
              <RouterLink to="/register">Register</RouterLink>
              <br />
              <br />
              <div class="form-group">
                <BaseBtn :loading="loading" label="Login" icon="login-icon" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
      <button @click="goHome" class="btn btn-secondary">
        <i class="fas fa-home"></i> Back to Home
      </button>
    </div>
    </div>
  </div>
</template>
