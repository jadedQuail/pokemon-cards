import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ref, useSSRContext, computed, mergeProps } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import 'vue-bundle-renderer/runtime';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _imports_0 = "" + buildAssetsURL("pokemon-svgrepo-com.CLQxl3Sx.png");
const _sfc_main$6 = {
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const buttonClass = computed(() => {
      const baseClass = "text-white text-2xl px-3 py-2 rounded";
      const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-700",
        green: "bg-green-500 hover:bg-green-700",
        red: "bg-red-500 hover:bg-red-700"
      };
      return `${baseClass} ${colorClasses[props.color] || ""}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: buttonClass.value,
        type: "button"
      }, _attrs))}>${ssrInterpolate(__props.text)}</button>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Button.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "TableHeader",
  __ssrInlineRender: true,
  props: {
    columns: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<thead${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(__props.columns, (column) => {
        _push(`<th class="border border-black bg-gray-200 px-4 py-3">${ssrInterpolate(column)}</th>`);
      });
      _push(`<!--]--></thead>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableHeader.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "TableCell",
  __ssrInlineRender: true,
  props: {
    value: {
      type: [String, Number, Boolean],
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<td${ssrRenderAttrs(mergeProps({ class: "border border-black px-4 py-3" }, _attrs))}>${ssrInterpolate(__props.value)}</td>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableCell.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "TableRow",
  __ssrInlineRender: true,
  props: {
    row: Object,
    columns: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(__props.columns, (column, index) => {
        _push(ssrRenderComponent(_sfc_main$4, {
          key: index,
          value: __props.row[column]
        }, null, _parent));
      });
      _push(`<!--]--></tr>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableRow.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "DataTable",
  __ssrInlineRender: true,
  setup(__props) {
    const columns = ref([]);
    const data = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center" }, _attrs))}><div class="w-full lg:w-3/4"><table class="min-w-full border border-black">`);
      _push(ssrRenderComponent(_sfc_main$5, { columns: columns.value }, null, _parent));
      _push(`<tbody><!--[-->`);
      ssrRenderList(data.value, (row, index) => {
        _push(ssrRenderComponent(_sfc_main$3, {
          key: index,
          row,
          columns: columns.value
        }, null, _parent));
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "AddPokemon",
  __ssrInlineRender: true,
  emits: ["pokemon-added"],
  setup(__props, { emit: __emit }) {
    let axios;
    const formData = ref({});
    const types = ref([]);
    const sets = ref([]);
    const emit = __emit;
    const submitPokemon = async () => {
      try {
        const dataToSend = { ...formData.value };
        const response = await axios.post(
          `${process.env.API_URL}/add-pokemon`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        emit("pokemon-added");
      } catch (error) {
        console.error("Error posting data:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center" }, _attrs))} data-v-9f4243da><form class="border border-black rounded shadow-lg p-10" data-v-9f4243da><label class="add-pokemon-label" for="name" data-v-9f4243da>Name:</label><br data-v-9f4243da><input${ssrRenderAttr("value", formData.value.pokemonName)} class="add-pokemon-input" type="text" id="name" name="name" data-v-9f4243da><br data-v-9f4243da><label class="add-pokemon-label" for="hp" data-v-9f4243da>HP:</label><br data-v-9f4243da><input${ssrRenderAttr("value", formData.value.pokemonHP)} class="add-pokemon-input" type="number" id="hp" name="hp" data-v-9f4243da><br data-v-9f4243da><label class="add-pokemon-label" for="type" data-v-9f4243da>Type:</label><br data-v-9f4243da><select class="add-pokemon-input" name="type" id="type" data-v-9f4243da><!--[-->`);
      ssrRenderList(types.value, (type) => {
        _push(`<option${ssrRenderAttr("value", type)} data-v-9f4243da>${ssrInterpolate(type)}</option>`);
      });
      _push(`<!--]--></select><br data-v-9f4243da><label class="add-pokemon-label" for="set" data-v-9f4243da>Set:</label><br data-v-9f4243da><select class="add-pokemon-input" name="set" id="set" data-v-9f4243da><!--[-->`);
      ssrRenderList(sets.value, (set) => {
        _push(`<option${ssrRenderAttr("value", set)} data-v-9f4243da>${ssrInterpolate(set)}</option>`);
      });
      _push(`<!--]--></select><br data-v-9f4243da><p data-v-9f4243da><label class="add-pokemon-label" for="flavor-text" data-v-9f4243da>Flavor Text:</label><br data-v-9f4243da></p><textarea class="add-pokemon-input" id="flavor-text" name="flavor-text" rows="4" cols="50" data-v-9f4243da>${ssrInterpolate(formData.value.pokemonFlavorText)}</textarea><br data-v-9f4243da>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        text: "Submit",
        onClick: submitPokemon,
        color: "green"
      }, null, _parent));
      _push(`</form></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddPokemon.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddPokemon = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9f4243da"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const showForm = ref(false);
    const toggleForm = () => {
      console.log("Called!");
      showForm.value = !showForm.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mt-20 flex flex-col items-center text-center"><img class="logo-img" alt="Pokeball logo"${ssrRenderAttr("src", _imports_0)}><h1 class="font-sans text-4xl text-indigo-400 mb-10"> Pok\xE9mon Cards </h1><div class="mb-10">`);
      if (!showForm.value) {
        _push(ssrRenderComponent(_sfc_main$6, {
          text: "Add Pokemon",
          color: "blue",
          onClick: toggleForm
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showForm.value) {
        _push(ssrRenderComponent(_sfc_main$6, {
          text: "Go Back",
          color: "red",
          onClick: toggleForm
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-40">`);
      if (!showForm.value) {
        _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showForm.value) {
        _push(ssrRenderComponent(AddPokemon, { onPokemonAdded: toggleForm }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ivMB2vrC.mjs.map
