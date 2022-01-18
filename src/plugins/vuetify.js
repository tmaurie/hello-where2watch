import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const opts = {
    icons: {
        iconfont: 'mdiSvg',
    },
    theme : {
        dark : true,
        themes : {
            light : {
                primary: '#7289da',
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                // background: colors.indigo.lighten5, // Not automatically applied
            },
            dark: {
                primary: '#7289da',
                background: '#1e2124'
            }
        }
    }
}

export default new Vuetify(opts)
