<!--
  Matomo - free/libre analytics platform

  @link    https://matomo.org
  @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <div v-if="paidPluginsToInstallAtOnceArray.length">
    <button
      class="btn"
      @click.prevent="onInstallAllPaidPlugins()"
      :disabled="disabled"
    >
      <MatomoLoader v-if="loading"/>
      {{ translate('Marketplace_InstallPurchasedPlugins') }}
    </button>
    <div
      class="ui-confirm"
      id="installAllPaidPluginsAtOnce"
      ref="installAllPaidPluginsAtOnce"
    >
      <h2>{{ translate('Marketplace_InstallAllPurchasedPlugins') }}</h2>
      <p>
        {{ translate('Marketplace_InstallThesePlugins') }}
      </p>
      <ul>
        <li v-for="pluginDisplayName in paidPluginsToInstallAtOnceArray" :key="pluginDisplayName">
          {{ pluginDisplayName }}
        </li>
      </ul>
      <p>
        <input
          role="install"
          type="button"
          :data-href="installAllPaidPluginsLink"
          :value="translate(
                  'Marketplace_InstallAllPurchasedPluginsAction',
                  paidPluginsToInstallAtOnceArray.length,
                )"
        />
        <input
          role="cancel"
          type="button"
          :value="translate('General_Cancel')"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Matomo, MatomoUrl, MatomoLoader, AjaxHelper,
} from 'CoreHome';

interface installAllPaidPluginsButton {
  paidPluginsToInstallAtOnceArray: Array<string>;
  installNonceValue: string;
}
export default defineComponent({
  components: { MatomoLoader },
  props: {
    paidPluginsToInstallAtOnce: {
      type: Array,
      required: false,
      default: () => [],
    },
    installNonce: {
      type: String,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data(): installAllPaidPluginsButton {
    return {
      paidPluginsToInstallAtOnceArray: (this.paidPluginsToInstallAtOnce ?? []) as Array<string>,
      installNonceValue: '',
    };
  },
  created() {
    if (!this.installNonceValue) {
      AjaxHelper.fetch({
        module: 'Marketplace',
        action: 'getPaidPluginsToInstallAtOnceParams',
      }).then((response) => {
        if (response) {
          this.paidPluginsToInstallAtOnceArray = response.paidPluginsToInstallAtOnce;
          this.installNonceValue = response.installAllPluginsNonce;
        }
      });
    }
  },
  methods: {
    onInstallAllPaidPlugins() {
      Matomo.helper.modalConfirm(this.$refs.installAllPaidPluginsAtOnce as HTMLElement);
    },
  },
  computed: {
    installAllPaidPluginsLink() {
      return `?${MatomoUrl.stringify({
        ...MatomoUrl.urlParsed.value,
        module: 'Marketplace',
        action: 'installAllPaidPlugins',
        nonce: this.installNonceValue,
      })}`;
    },
  },
});
</script>
