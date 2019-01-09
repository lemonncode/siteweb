<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Regístrate para viajar</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.firstName"
                        :rules="firstNameRules"
                        type="text"
                        label="Nombre"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.lastName"
                        :rules="lastNameRules"
                        type="text"
                        label="Apellidos"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.phoneNumber"
                        :rules="phoneNumberRules"
                        type="text"
                        label="Número de teléfono"
                        append-icon="smartphone"
                        mask="### ### ###"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.email"
                        :rules="emailRules"
                        type="text"
                        label="Email"
                        append-icon="email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.password"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click:append="showPassword = !showPassword"
                        label="Contraseña"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <v-layout justify-space-between>
              <v-dialog width="600px">
                <p slot="activator" color="primary" >Al registrarte, aceptas nuestra <span style="color: #ed6363">Política de privacidad</span></p>
                <v-card>
                  <v-card-title>
                    <span class="headline">Política de privacidad</span>
                  </v-card-title>
                  <v-card-text>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <p>Siguiendo los principios de licitud, lealtad y transparencia, ponemos a su disposición la presente Política de Privacidad.</p>
                          <h3>¿Quién es el Responsable del tratamiento de sus datos?</h3>
                          <p>AURO NEW TRANSPORT CONCEPT S.L.</p>

                          <p>Calle Dehesa Vieja, 55 - 28052 Madrid</p>
                          <p>Teléfono: 666 663 036 </p>
                          <p>Email: privados@auro-group.com</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Con qué finalidad tratamos sus datos personales?</h3>
                          <p>En AURO NEW TRANSPORT CONCEPT S.L. tratamos la información que nos facilita con la finalidad de gestionar la relación contractual que nos une, gestionar el envío de la información que nos solicita, facilitar a los interesados ofertas de nuestros servicios y/o productos de su interés y/o gestionar su candidatura.</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Por cuánto tiempo conservaremos sus datos personales?</h3>
                          <p>Sus datos, serán conservados el tiempo mínimo necesario para la correcta prestación del servicio ofrecido así como para atender las responsabilidades que se pudieran derivar del mismo y de cualquier otra exigencia legal.</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
                          <p>La base legal para el tratamiento de sus datos personales puede ser la ejecución de una relación contractual potencial y/o suscrita, el interés legítimo, la habilitación legal y/o el consentimiento del propio interesado. Los datos que le solicitamos son adecuados, pertinentes y estrictamente necesarios y en ningún caso está obligado a facilitárnoslos, pero su no comunicación podrá afectar a la finalidad del servicio o la imposibilidad de prestarlo. </p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿A qué destinatarios se comunicarán sus datos?</h3>
                          <p>AURO NEW TRANSPORT CONCEPT S.L.no comunicará sus datos a ningún tercero, salvo que se informe de ello expresamente. </p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Cuáles son sus derechos cuando nos facilita sus datos?</h3>
                          <p>Los derechos de protección de datos de los que son titulares los interesados son:</p>
                          <ul>
                            <li>Derecho a solicitar el acceso a los datos personales relativos al interesado</li>
                            <li>Derecho de rectificación o supresión</li>
                            <li>Derecho de oposición</li>
                            <li>Derecho a solicitar la limitación de su tratamiento </li>
                            <li>Derecho a la portabilidad de los datos</li>
                          </ul>
                          <p>Los titulares de los datos personales obtenidos, podrán ejercer sus derechos de protección de datos personales dirigiendo una comunicación por escrito al domicilio social de AURO NEW TRANSPORT CONCEPT S.L. o al correo electrónico habilitado a tal efecto, privados@auro-group.com, incluyendo en ambos casos fotocopia de su DNI u otro documento de identificación equivalente.</p>
                          <p>Modelos, formularios y más información disponible sobre sus derechos en la página web de la autoridad de control nacional, Agencia Española de Protección de Datos, en adelante, AEPD, www.agpd.es.</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Puedo retirar el consentimiento?</h3>
                          <p>Usted tiene la posibilidad y el derecho a retirar el consentimiento para cualquiera finalidad específica otorgada en su momento, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>¿Dónde puedo reclamar en caso de que considere que no se tratan mis datos correctamente?</h3>
                          <p>Si algún interesado considera que sus datos no son tratados correctamente por AURO NEW TRANSPORT CONCEPT S.L. puede dirigir sus reclamaciones al correo privados@auro-group.com o a la autoridad de protección de datos que corresponda, siendo la AEPD la indicada en el territorio nacional, www.agpd.es </p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>Seguridad y actualización de sus datos personales</h3>
                          <p>Con el objetivo de salvaguardar la seguridad de sus datos personales, le informamos que AURO NEW TRANSPORT CONCEPT S.L. ha adoptado todas las medidas de índole técnica y organizativa necesarias para garantizar la seguridad de los datos personales suministrados. Todo ello para evitar su alteración, pérdida, y/o tratamientos o accesos no autorizados, tal como exige la normativa, si bien la seguridad absoluta no existe. </p>
                          <p>Es importante que, para que podamos mantener sus datos personales actualizados, nos informe siempre que se produzca una modificación de los mismos. </p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex>
                      <v-card flat>
                        <v-card-text>
                          <h3>Confidencialidad</h3>
                          <p>AURO NEW TRANSPORT CONCEPT S.L. le informa que sus datos serán tratados con el máximo celo y confidencialidad por todo el personal que intervenga en cualquiera de las fases del tratamiento. No cederemos ni comunicaremos a ningún tercero sus datos, excepto en los casos legalmente previstos, o salvo que el interesado nos hubiera autorizado expresamente.</p>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-layout>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="submit">Regístrate</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        user: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
        },
        valid: false,
        firstNameRules: [
          v => !!v || 'Introduce tu nombre',
        ],
        lastNameRules: [
          v => !!v || 'Introduce tus apellidos',
        ],
        phoneNumberRules: [
          v => !!v || 'Introduce tu número de teléfono',
          v => /^\d{9}$/.test(v) || 'Número de teléfono inválido',
        ],
        emailRules: [
          v => !!v || 'Introduce un email',
          v => /.+@.+/.test(v) || 'Email inválido',
        ],
        passwordRules: [
          v => !!v || 'Introduce una contraseña',
          v => v.length >= 8 || 'Usa 8 caracteres como mínimo para la contraseña',
        ],
        showPassword: false,
      };
    },
    methods: {
      submit() {
        if (!this.$refs.form.validate()) {
          return
        }

        this.$store.dispatch('user/register', this.user)
          .then(() => {
            this.$store.dispatch('user/login', this.user).then(() => {
              this.showLoginSuccess({ message: `Bienvenido ${this.$auth.user.first_name}` })
            })
          })
          .catch(error => {
            this.displayMessageError(error.response)
          })
      },
      cancel() {
        this.$router.push({ name: 'index' })
      },
      displayMessageError(response) {
        let notification = {}

        if (response !== undefined) {
          for (let [key, value] of Object.entries(response.data.errors.children)) {
            if (value.errors !== undefined && value.errors.length > 0) {
              notification = { message: value.errors[0] }
              break
            }
          }
        }

        this.showRegistrationError(notification)
      }
    },
    notifications: {
      showRegistrationError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showLoginSuccess: {
        message: 'sesión iniciada con éxito',
        type: 'success'
      }
    }
  }
</script>