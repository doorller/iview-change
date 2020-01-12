
import $http from '../assets/js/config/$http'
import toast from './toast'
import modal from './modal'
import diretives from './directive'

import Table from '../pages/components/Table'
import Page from '../pages/components/Page'
import PageHeader from '../pages/components/PageHeader'
import Select from '../pages/components/Select'
import DatePicker from '../pages/components/DatePicker'
import Input from '../pages/components/Input'
import Modal from '../pages/components/Modal'
import Upload from '../pages/components/Upload'
import Switcher from '../pages/components/Switcher'
import Button from '../pages/components/Button'
import Checkbox from '../pages/components/Checkbox'
import SingleRadio from '../pages/components/SingleRadio'
import Radio from '../pages/components/Radio'
import Title from '../pages/components/Title'
import Dialog from '../pages/components/Dialog'
import CheckboxPage from "../pages/components/CheckboxPage"
import Tooltip from "../pages/components/Tooltip"

const components = {
    Table,
    Page,
    PageHeader,
    Select,
    DatePicker,
    Input,
    Modal,
    Upload,
    Switcher,
    Button,
    Checkbox,
    SingleRadio,
    Title,
    Dialog,
    Radio,
    CheckboxPage,
    Tooltip
}

export default {
  install(Vue) {
    Vue.prototype.$http = $http;
    Vue.prototype.$modal = modal;
    Vue.use(toast);
    for (let key in components) {
      Vue.component(key, components[key]);
    }

    for (let key in diretives) {
      Vue.directive(key, diretives[key]);
    }
  }
};