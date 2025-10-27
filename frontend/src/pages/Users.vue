
<template>
  <div>
    <h1>Users</h1>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
      <div>
        <button @click="showCreateModal = true">Create user</button>
        <button @click="fetchUsers" style="margin-left:8px">Refresh</button>
      </div>
      <div>
        <button @click="logout">Logout</button>
      </div>
    </div>

    <table class="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>
            <button @click="openEditModal(u)">Edit</button>
            <button @click="deleteUser(u._id)" style="background:#ef4444">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h3>Create user</h3>
        <input v-model="newUser.name" placeholder="Name" />
        <input v-model="newUser.email" placeholder="Email" />
        <input v-model="newUser.password" placeholder="Password" type="password" />
        <div style="margin-top:12px">
          <button @click="createUser">Create</button>
          <button @click="showCreateModal=false" style="margin-left:8px">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit user</h3>
        <input v-model="editUser.name" placeholder="Name" />
        <input v-model="editUser.email" placeholder="Email" />
        <div style="margin-top:12px">
          <button @click="saveEdit">Save</button>
          <button @click="showEditModal=false" style="margin-left:8px">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      users: [],
      newUser: { name: '', email: '', password: '' },
      showCreateModal: false,
      showEditModal: false,
      editUser: { id: null, name: '', email: '' }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await api.get('/users')
        this.users = res.data
      } catch (err) {
        alert('Failed to fetch users')
        this.$router.push('/')
      }
    },
    openEditModal(u) {
      this.editUser = { id: u._id, name: u.name, email: u.email }
      this.showEditModal = true
    },
    async createUser() {
      try {
        await api.post('/users', this.newUser)
        this.newUser = { name: '', email: '', password: '' }
        this.showCreateModal = false
        this.fetchUsers()
      } catch (err) {
        alert('Failed to create user')
      }
    },
    async saveEdit() {
      try {
        await api.put(`/users/${this.editUser.id}`, { name: this.editUser.name, email: this.editUser.email })
        this.showEditModal = false
        this.fetchUsers()
      } catch (err) {
        alert('Failed to update user')
      }
    },
    async deleteUser(id) {
      if (!confirm('Delete user?')) return
      try {
        await api.delete(`/users/${id}`)
        this.fetchUsers()
      } catch (err) {
        alert('Failed to delete user')
      }
    },
    logout() {
      localStorage.removeItem('jwt')
      this.$router.push('/')
    }
  }
}
</script>

<style>
.users-table { width: 100%; border-collapse: collapse; margin-top: 12px }
.users-table th, .users-table td { text-align: left; padding: 8px; border-bottom: 1px solid #eee }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center }
.modal-content { background: white; padding: 18px; border-radius: 8px; width: 340px }
.modal-content input { width: 100%; margin:6px 0; padding:8px }
</style>
