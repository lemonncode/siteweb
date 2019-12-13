<template>
  <div>
      <section>
        <v-parallax src="hero1.jpg" height="520">
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
            <img src="logo4.png" alt="Auro" height="320px"/>
            <!--
            <h1 class="white--text mb-2 display-3 text-xs-center">Auro</h1>
            -->
            <div class="subheading mb-2 mt-4 text-xs-center" style="font-weight: bold">
              Servicios de transporte privado
            </div>
            <v-btn :to="{name: 'app'}" class="secondary mt-5" dark large>
              Reservar vehículo
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>
      <section>
          <v-container grid-list-xl>
            <v-layout row wrap align-center>
              <v-flex xs12 md6>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <a href="https://apps.apple.com/es/app/auro/id1472989771" target="_blank">
                      <v-img
                        class="white--text align-end"
                        src="iphone.png"
                      >
                      </v-img>
                    </a>
                  </v-card-text>
                  <v-responsive class="text-xs-center">
                    <a href="https://apps.apple.com/es/app/auro/id1472989771" target="_blank">
                      <img src="appstore.png">
                    </a>
                  </v-responsive>
                </v-card>
              </v-flex>
              <v-flex xs12 md6>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <a href="https://play.google.com/store/apps/details?id=site.auro.rider" target="_blank">
                      <v-img
                        class="white--text align-end"
                        src="android.png"
                      >
                      </v-img>
                    </a>
                  </v-card-text>
                  <v-responsive class="text-xs-center">
                      <a href="https://play.google.com/store/apps/details?id=site.auro.rider" target="_blank">
                        <img src="google_play.png">
                      </a>
                  </v-responsive>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
      </section>



      <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">La manera más cómoda de viajar</h2>
              <span class="subheading">
                La comodidad y lujo de moverse en coche con conductor y a un precio asequible
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="primary--text text--lighten-2">stars</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">EXCELENTE</div>
                    </v-card-title>
                    <v-card-text style="min-height: 150px">
                      Seriedad, puntualidad, discreción, amabilidad y profesionalidad son nuestros principales valores.
                      Nuestros choferes van uniformados y hablan diferentes idiomas extranjeros.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="primary--text text--lighten-2">event_available</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">FLEXIBLE</div>
                    </v-card-title>
                    <v-card-text style="min-height: 150px">
                      Operamos las <strong>24 horas</strong>, <strong>7 días a la semana</strong>, <strong>365 días al año</strong>.
                      Siempre encontrarás un operador dispuesto a ayudarte con una respuesta rápida y eficaz.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="primary--text text--lighten-2">verified_user</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">SEGURO</div>
                    </v-card-title>
                    <v-card-text style="min-height: 150px">
                      Les ofrecemos todas las garantías exigidas por la actual Ley de transporte.
                      Vehículos geo localizados, selección de personal rigurosa, vehículos con máximas
                      prestaciones de seguridad, servicio técnico y gestión de tráfico las <strong>24h</strong>,
                      asegurando al <strong>100%</strong> la máxima cobertura de cualquier servicio realizado con choferes de gran
                      presencia y muy experimentados.
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <v-parallax src="hero2.jpg" height="480">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Viajar nunca ha sido tan sencillo</div>
            <v-btn
              class="secondary mt-5"
              dark
              large
              :to="{name: 'app'}"
            >
              Planificar viaje
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-layout
          column
          wrap
          align-center
          class="primary white--text lighten-1"
        >
          <v-flex xs12 sm4 class="my-5">
            <div class="text-xs-center">
              <h2 class="headline">Un servicio acorde a sus necesidades</h2>
              <span class="subheading">
                La comodidad y lujo de moverse en coche con conductor y a un precio asequible
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">business</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Empresas</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Ofrecemos una solución a la medida para brindar los mejores servicios de transporte a empresas
                      u organizaciones. Sistemas de facturación mensual, reserva y control de servicios,
                      poniendo a su disposición una herramienta web con la última tecnología.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">flight_land</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Visitas de Negocio</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Servicio de traslados para visitas de negocios, grandes actos o eventos políticos y comerciales.
                      Cuando estas de viaje fuera de tu ciudad, necesitas seguridad, comodidad y confianza en tus traslados.
                      Le aseguramos la máxima confidencialidad.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">swap_horiz</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Transfer</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Traslados en aeropuertos y estaciones de tren. Recepción en la propia terminal, con carteleria
                      (personalizada si lo necesita), ayuda con equipaje y con la seguridad, puntualidad y la
                      atención al cliente como valores principales de nuestra empresa.
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">pool</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Eventos Deportivos</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Transporte y desplazamientos para eventos deportivos. Disponemos del personal adecuado para
                      ayudarle en la perfecta organización de los traslados, desde origen a finalización.
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">cake</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Celebraciones</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Brindamos el servicio de traslado para celebraciones y eventos especiales:
                      Bautizos, Comuniones, Bodas, Cumpleaños, Fiestas, etc. Déjelo en nuestras manos, organizamos
                      sus traslados según sus necesidades.
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 md4 offset-sm1>
                  <v-card class="elevation-0 transparent white--text">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="white--text">airport_shuttle</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Excursiones</div>
                    </v-card-title>
                    <v-card-text style="min-height: 100px">
                      Visite ciudades cercanas a Madrid como Toledo, Ávila o Segovia.
                      Sabemos que este es un servicio muy personal y por ello nos adaptamos a sus necesidades sean
                      las que sean. Nunca hacer turismo había sido tan fácil y cómodo. Nuestros conductores
                      son grandes profesionales que hablan diferentes idiomas extranjeros.
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap class="my-3">
            <v-flex xs12>
              <div class="text-xs-center">
                <h2 class="headline">Dónde nos puedes encontrar</h2>
                <span class="subheading">
                  Prestamos servicio en las principales ciudades de España
                </span>
              </div>
            </v-flex>

            <v-flex
              v-for="card in cards"
              v-bind="{ [`xs${card.flex}`]: true }"
              :key="card.title"
              xs12
              sm6
            >
              <v-card>
                <v-img
                  :src="card.src"
                  height="320px"
                >
                  <v-container
                    fill-height
                    fluid
                    pa-2
                  >
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="card.title"></span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-img>

              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <section>
        <v-parallax src="hero3.jpg" height="480">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Reserva tu vehículo a través de nuestra Aplicación Web</div>
            <v-btn
              class="secondary mt-5"
              dark
              large
              :to="{name: 'app'}"
            >
              Acceder a la aplicación
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Quiénes somos ?</div>
                </v-card-title>
                <v-card-text>
                  <p>
                    La mayor flota de vehículos privados de España. Le ofrecemos un servicio de coches con
                    conductor, legal, profesional, serio, discreto y a su medida.
                  </p>
                  <p>
                    Sabemos que este es un servicio muy personal y por ello nos adaptamos a sus necesidades
                    sean las quesean. Reservar con nosotros es tener la garantía de que todo va a ir bien.
                  </p>
                  <p>
                    Servicios a nivel nacional con sedes en Madrid, Barcelona, Málaga y Valencia.
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contacto</div>
                </v-card-title>
                <v-card-text>
                  Puedes contactar con nosotros las 24 horas
                </v-card-text>
                <v-list class="transparent">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="primary--text text--lighten-2">phone</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>671-100-037</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="primary--text text--lighten-2">place</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>C/ Dehesa Vieja Nº55, Madrid, España</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon class="primary--text text--lighten-2">email</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>privados@auro-group.com</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section><no-ssr>
    <cookie-law theme="blood-orange" buttonText="Aceptar">
      <div slot="message">
        Utilizamos cookies propias y de terceros para mejorar nuestros servicios, elaborar información estadística,
        analizar sus hábitos de navegación e inferir grupos de interés. Esto nos permite personalizar el contenido que ofrecemos y
        mostrarle publicidad relacionada con sus preferencias. Al clicar en "Aceptar", ACEPTA SU USO.
        <router-link to="politica-de-cookies" style="color: #ed6363">Pinche para ver nuestra política de cookies.</router-link>
      </div>
    </cookie-law>
  </no-ssr>
  </div>
</template>

<script>
    import CookieLaw from 'vue-cookie-law'

    export default {
        data () {
            return {
                cards: [
                    { title: 'Madrid', src: '80002155_s.jpg', flex: 6 },
                    { title: 'Barcelona', src: '12886892_s.jpg', flex: 6 },
                    { title: 'Valencia', src: '26558901_s.jpg', flex: 6 },
                    { title: 'Málaga', src: '62647239_s.jpg', flex: 6 }
                ]}
        },
        components: {
            CookieLaw
        }
    }

</script>
