export const datatableMixin = {
  data: () => ({
    items: [],
    totalItems: 0,
    search: '',
    options: {},
    loading: false,
    itemsPerPageOptions: [10, 20, 30, 40, 500]
  }),
  computed: {
    params () {
      return {
        ...this.options,
        query: this.search
      }
    },
    queryParams () {
      const params = {
        account: this.current_account.discriminator == 'personal' ? this.current_account.id: this.current_account.account.id,
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage
      }
      if (this.search) {
        params.query = this.search
      }
      if (this.startDate) {
        params.date = this.startDate
      }
      if (this.endDate) {
        params.endDate = this.endDate
      }
      if (this.user) {
        params.user = this.user
      }
      if (this.csv) {
        params.csv = true
      }
      if (this.options.sortBy) {
        let i = -1
        params.sortBy = []
        this.options.sortBy.forEach((name) => {
          let direction = this.options.sortDesc[++i]
          direction = direction === undefined ? 'asc' : (direction ? 'desc' : 'asc')
          params.sortBy.push(name + ':' + direction)
        })
      }
      return params
    }
  },
  watch: {
    params: {
      handler () {
        this.loadItems()
      },
      deep: true
    }
  },
  methods: {
    async loadItems () {
      this.loading = true
      this.items = []

      const response = await this.resource.cget(this.queryParams)
      this.items = response.data
      this.totalItems = parseInt(response.headers['pagination-total'])
      this.loading = false
    },
    deleteItem (id) {
      this.$swal({
        title: '¿Estás seguro de que quieres borrar este registro?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if (result.value) {
          this.doDeleteItem(id)
        }
      })
    },
    async doDeleteItem (id) {
      try {
        await this.resource.delete(id)
        this.loadItems()
        this.$toast.success('Registro borrado exitosamente')
      } catch (error) {
        this.$toast.error(error.response ? error.response.data.message : 'Error de conexión')
      }
    },
    viewItem () {

    }
  }
}
