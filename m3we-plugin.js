// https://cdn.jsdelivr.net/gh/kyfex-uwu/m3we-plugin@main/m3we-plugin.js
//plugin link

(function() {
    var button;
    var propsPanel;
    var plugNPlayPanel;
    var scriptPanel;
    var propMode;

    const materials=["AIR"].concat(["STRUCTURE_VOID", "PORTAL", "CARPET", "PLANT", "UNDERWATER_PLANT",
        "REPLACEABLE_PLANT", "NETHER_SHOOTS", "REPLACEABLE_UNDERWATER_PLANT", "WATER", "BUBBLE_COLUMN",
        "LAVA", "SNOW_LAYER", "FIRE", "DECORATION", "COBWEB", "SCULK", "REDSTONE_LAMP", "ORGANIC_PRODUCT",
        "SOIL", "SOLID_ORGANIC", "DENSE_ICE", "AGGREGATE", "SPONGE", "SHULKER_BOX", "WOOD", "NETHER_WOOD",
        "BAMBOO_SAPLING", "BAMBOO", "WOOL", "TNT", "LEAVES", "GLASS", "ICE", "CACTUS", "STONE", "METAL",
        "SNOW_BLOCK", "REPAIR_STATION", "BARRIER", "PISTON", "MOSS_BLOCK", "GOURD", "EGG", "CAKE",
        "AMETHYST", "POWDER_SNOW", "FROGSPAWN", "FROGLIGHT"].sort());
    const sounds=["WOOD", "GRAVEL", "GRASS", "LILY_PAD", "STONE", "METAL", "GLASS", "WOOL", "SAND",
        "SNOW", "POWDER_SNOW", "LADDER", "ANVIL", "SLIME", "HONEY", "WET_GRASS", "CORAL", "BAMBOO",
        "BAMBOO_SAPLING", "SCAFFOLDING", "SWEET_BERRY_BUSH", "CROP", "STEM", "VINE", "NETHER_WART",
        "LANTERN", "NETHER_STEM", "NYLIUM", "FUNGUS", "ROOTS", "SHROOMLIGHT", "WEEPING_VINES",
        "WEEPING_VINES_LOW_PITCH", "SOUL_SAND", "SOUL_SOIL", "BASALT", "WART_BLOCK", "NETHERRACK",
        "NETHER_BRICKS", "NETHER_SPROUTS", "NETHER_ORE", "BONE", "NETHERITE", "ANCIENT_DEBRIS",
        "LODESTONE", "CHAIN", "NETHER_GOLD_ORE", "GILDED_BLACKSTONE", "CANDLE", "AMETHYST_BLOCK",
        "AMETHYST_CLUSTER", "SMALL_AMETHYST_BUD", "MEDIUM_AMETHYST_BUD", "LARGE_AMETHYST_BUD", "TUFF",
        "CALCITE", "DRIPSTONE_BLOCK", "POINTED_DRIPSTONE", "COPPER", "CAVE_VINES", "SPORE_BLOSSOM",
        "AZALEA", "FLOWERING_AZALEA", "MOSS_CARPET", "MOSS_BLOCK", "BIG_DRIPLEAF", "SMALL_DRIPLEAF",
        "ROOTED_DIRT", "HANGING_ROOTS", "AZALEA_LEAVES", "SCULK_SENSOR", "SCULK_CATALYST", "SCULK",
        "SCULK_VEIN", "SCULK_SHRIEKER", "GLOW_LICHEN", "DEEPSLATE", "DEEPSLATE_BRICKS", "DEEPSLATE_TILES",
        "POLISHED_DEEPSLATE", "FROGLIGHT", "FROGSPAWN", "MANGROVE_ROOTS", "MUDDY_MANGROVE_ROOTS", "MUD",
        "MUD_BRICKS", "PACKED_MUD"].sort();
    const colors=["CLEAR"].concat(["PALE_GREEN", "PALE_YELLOW", "WHITE_GRAY", "BRIGHT_RED", "PALE_PURPLE",
        "IRON_GRAY", "DARK_GREEN", "WHITE", "LIGHT_BLUE_GRAY", "DIRT_BROWN", "STONE_GRAY", "WATER_BLUE",
        "OAK_TAN", "OFF_WHITE", "ORANGE", "MAGENTA", "LIGHT_BLUE", "YELLOW", "LIME", "PINK", "GRAY",
        "LIGHT_GRAY", "CYAN", "PURPLE", "BLUE", "BROWN", "GREEN", "RED", "BLACK", "GOLD", "DIAMOND_BLUE",
        "LAPIS_BLUE", "EMERALD_GREEN", "SPRUCE_BROWN", "DARK_RED", "TERRACOTTA_WHITE", "TERRACOTTA_ORANGE",
        "TERRACOTTA_MAGENTA", "TERRACOTTA_LIGHT_BLUE", "TERRACOTTA_YELLOW", "TERRACOTTA_LIME",
        "TERRACOTTA_PINK", "TERRACOTTA_GRAY", "TERRACOTTA_LIGHT_GRAY", "TERRACOTTA_CYAN", "TERRACOTTA_PURPLE",
        "TERRACOTTA_BLUE", "TERRACOTTA_BROWN", "TERRACOTTA_GREEN", "TERRACOTTA_RED", "TERRACOTTA_BLACK",
        "DULL_RED", "DULL_PINK", "DARK_CRIMSON", "TEAL", "DARK_AQUA", "DARK_DULL_PINK", "BRIGHT_TEAL",
        "DEEPSLATE_GRAY", "RAW_IRON_PINK", "LICHEN_GREEN"].sort());

    function itemModel(namespace, name){
        return JSON.stringify({
            parent:namespace,
            block:name
        },null,2);
    };
    function itemGen(namespace, name){
        return JSON.stringify({
            namespace:namespace,
            itemName:name,
            blockToPlace:namespace+":"+name
        },null,2);
    }
    function readme(namespace,block){
        return "- Put the "+namespace+" folder in (minecraft folder)/config/m3we/resources so your block has visuals in game. (You can rename this folder, if you want)\n"+
            "- Put "+block+"_block.json file in (minecraft folder)/config/m3we/blocks so your block behaves correctly in game. (You can rename this file, too!)\n"+
            "- Put "+block+"_item.json file in (minecraft folder)/config/m3we/items so your block has an item attached to it. (If you rename this, the game will crash - just kidding, you can rename it too)\n"+
            "- Put "+block+"_script.lua file in (minecraft folder)/config/m3we/scripts so your block has a script attached to it. (ignore me if there is no script, and this one you can't rename)\n"+
            "\nIf you have any questions contact me on discord @kyfexuwu";
    };
    function blockstateGen(namespace,block){
        let toReturn={
          "variants": {
            "": {
              "model": namespace+":block/"+block
            }
          }
        };

        for(let runnable of Object.values(plugNPlayData.runnables.blockstateGen))
            runnable(toReturn);

        return JSON.stringify(toReturn,null,2);
    }

    const plugNPlayData={
        rotTypes:["None","4 Axes"],

        blockData:{
            blockShape: false,
        },
        blockStates:{},
        script:{
            outsideData:{},
            getStateOnPlace: false,
        },

        runnables:{
            blockstateGen:{},
        },
    };

    const blockProps=[
        //[name, inputType, type, value, (enumValues)]
        ["namespace",           "text",     "namespace",    "m3we"],
        ["blockName",           "text",     "blockName",    "name"],
        ["blockText",           "text",     "text",         "Name",     "noSerialize"],
        ["hardness",            "text",     "float",        0.0],
        ["resistance",          "text",     "float",        0.0],
        ["slipperiness",        "text",     "float",        0.6],
        ["jumpMultiplier",      "text",     "float",        1.0],
        ["speedMultiplier",     "text",     "float",        1.0],
        ["sounds",              "enum",     "enum",         "STONE",    sounds],
        ["isOpaque",            "checkbox", "bool",         true],
        ["luminance",           "text",     "int",          0],         //or script
        ["mapColor",            "enum",     "enum",         "CLEAR",    colors],
        ["isToolRequired",      "checkbox", "bool",         false],
        ["ticksRandomly",       "checkbox", "bool",         false],
        ["isAir",               "checkbox", "bool",         false],
        ["isCollidable",        "checkbox", "bool",         true],
        ["blockCollisionCanResize","checkbox","bool",       false],
        ["isSolidWhen",         "checkbox", "boolOrScript", true],      //or script
        ["allowsSpawningWhen",  "checkbox", "boolOrScript", true],      //or script
        ["visionBlockedWhen",   "checkbox", "boolOrScript", false],     //or script
        ["suffocatesWhen",      "checkbox", "boolOrScript", false],     //or script
        ["emissiveLightingWhen","checkbox", "boolOrScript", false],     //or script
        ["postProcessWhen",     "checkbox", "boolOrScript", false],     //or script
    ];
    
    Plugin.register("m3we-plugin", {
        title: "m3we Plugin",
        author: "KYFEX",
        description: "A tool for making m3we asset creation even easier",
        icon: "build_circle",
        version: "0.0.0",
        variant: "both",
        onload() {
            Language.addTranslations("en",{
                "panel.properties": "Properties",
                "panel.plugNPlay": "Plug 'N' Play",
                "panel.script": "Script"
            });

            document.head.innerHTML+=`<style>
            .m3we-box{
                background-color: var(--color-dark);
                border: 1px solid var(--color-button);
            }
            ul[isInt="false"] li[integer]{
                display:none;
            }
            </style>`;

            let blockStates=[];
            propsPanel=new Panel("properties",{
                condition: { modes: ["properties"] },
                default_position: {
                    slot: 'left_bar',
                    float_position: [0, 0],
                    float_size: [300, 400],
                    height: 400
                },
                growable:true,
                component: {
                    name: 'panel-display',
                    data() {return {
                        properties:blockProps,
                        blockStates:blockStates,

                        namespaceValidator:/[a-z0-9_.-]+/,
                        blockNameValidator:/[a-z0-9/._-]+/,
                    }},
                    methods: {
                        propToReadable(text){
                            let toReturn=text[0].toUpperCase();
                            for(let i=1;i<text.length;i++){
                                if(text[i]!=text[i].toUpperCase()&&text[i]==text[i].toLowerCase()){//is lowercase
                                    toReturn+=text[i];
                                }else{//is uppercase
                                    toReturn+=" "+text[i];
                                }
                            }
                            return toReturn;
                        },
                        addBlockState(){
                            this.blockStates.push({
                                name:"blockstate",
                                type:"boolean",
                                def: false,

                                max:1,
                                min:0,
                                values:["one", "two"]
                            });
                        },
                        updateProp(event,type){
                            let val;

                            switch(type){
                                case "boolOrScript":
                                    event.target.parentNode.children[1].innerText=event.target.checked?'ALWAYS':'NEVER';
                                case "bool":
                                    val=event.target.checked;
                                    break;
                                case "enum":
                                case "text":
                                case "namespace":
                                case "blockName":
                                    if(type=="namespace")
                                        event.target.value=(event.target.value.match(this.namespaceValidator)||[""])[0];
                                    if(type=="blockName")
                                        event.target.value=(event.target.value.match(this.blockNameValidator)||[""])[0];

                                    val=event.target.value;
                                    break;
                                case "float":
                                    event.target.value=(event.target.value.match(/\d+\.?\d*/)||[0])[0];
                                    val=parseFloat(event.target.value);
                                    break;
                                case "int":
                                    event.target.value=(event.target.value.match(/\d+/)||[0])[0];
                                    val=parseInt(event.target.value);
                                    break;
                            }

                            this.properties[event.target.getAttribute("data-id")][3]=val;
                        },
                        updateBlockState(event, state){
                            state.type=event.target.value;
                            switch(state.type){
                                case "int":
                                    state.def=0;
                                    break;
                                case "enum":
                                    state.def=state.values[0];
                                    break;
                                case "bool":
                                    state.def=false;
                                    break;
                            }
                        },
                    },
                    //tl("translation.path") translates text
                    template: `
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li v-for="(property,index) of properties">
                                <p v-if="property[1]=='checkbox'" style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <input :data-id="index" 
                                    :checked="property[3]?true:null" :type="property[1]"
                                    @input="updateProp($event,property[2])"
                                    style="margin-left:5px; margin-right:5px;">
                                    <span v-if="property[2]=='boolOrScript'">{{property[3]?"ALWAYS":"NEVER"}}</span>
                                </p>
                                <p v-else-if="property[1]=='enum'" style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <select :data-id="index"
                                    @input="updateProp($event,property[2])">
                                        <option v-for="enumValue of property[4]">
                                            {{enumValue}}
                                        </option>
                                    </select>
                                </p>
                                <p v-else-if="property[1]=='text'" style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <input :data-id="index"
                                    @input="updateProp($event,property[2])"
                                    class="m3we-box dark_bordered"
                                    :value="property[3]" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px; flex-grow: 1; flex-shrink: 1;">
                                </p>
                            </li>
                            <br>
                            <li v-for="(state, index) of blockStates"><p>
                                Blockstate <input 
                                    class="m3we-box dark_bordered"
                                    style="margin-right:5px;"
                                    :value="state.name"
                                    @input="state.name=$event.target.value">

                                <ul style="margin-left:12px;">
                                    <li>Type:<select 
                                            class="m3we-box dark_bordered"
                                            @input="updateBlockState($event, state)">
                                        <option value="int" :selected="state.type=='int'">Integer</option>
                                        <option value="boolean" :selected="state.type=='boolean'">Boolean</option>
                                        <option value="enum" :selected="state.type=='enum'">Enum</option>
                                    </select></li>
                                    <li v-if="state.type=='int'">
                                        Default Value:<input
                                                class="m3we-box dark_bordered" 
                                                :value="state.def"
                                                @input="state.def=$event.target.value"

                                                :type="state.type=='int'?'number':'text'"
                                                step="1"
                                                :min="state.type=='int'?state.min:false"
                                                :max="state.type=='int'?state.max:false">
                                    </li>
                                    <li v-else-if="state.type=='enum'">
                                        Default Value:<select 
                                                class="m3we-box dark_bordered"
                                                @input="state.def=$event.target.value">
                                            <option v-for="(value) of state.values"
                                                    :value="value">
                                                {{value}}
                                            </option>
                                        </select>
                                    </li>
                                    <li v-else-if="state.type=='boolean'">
                                        Default Value:<input
                                                type="checkbox"
                                                :checked="!!state.value"
                                                @input="state.value=$event.target.checked">
                                    </li>
                                    <template v-if="state.type=='int'">
                                        <li>
                                            Max Value:<input
                                                    class="m3we-box dark_bordered" 
                                                    :value="state.max"
                                                    step="1"
                                                    @input="state.max=$event.target.value">
                                        </li>
                                        <li>
                                            Min Value:<input
                                                    class="m3we-box dark_bordered"
                                                    :value="state.min"
                                                    step="1"
                                                    @input="state.min=$event.target.value">
                                        </li>
                                    </template>
                                    <template v-if="state.type=='enum'">
                                        <li v-for="(value, index) of state.values">
                                            <input 
                                                    class="m3we-box dark_bordered" 
                                                    :value="value"
                                                    @input="state.values[index]=$event.target.value">
                                            <i 
                                                    class="material-icons notranslate icon"
                                                    @click="state.values.splice(index,1)">delete</i>
                                        </li>
                                        <li><button @click="state.values.push('value')">Add Value</button></li>
                                    </template>
                                    <li><button @click="blockStates.splice(index,1)">Remove Blockstate</button></li>
                                </ul>
                            </p></li>
                            <li>
                                <button @click="addBlockState()">Add Blockstate</button>
                            </li>
                        </ul>
                    `
                },
            });
            plugNPlayPanel=new Panel("plugNPlay",{
                condition: {modes: ["properties"]},
                default_position: {
                    slot: 'right_bar',
                    float_position: [0, 0],
                    float_size: [300, 400],
                    height: 400
                },
                growable:true,
                component: {
                    name: 'panel-display',
                    data() {return plugNPlayData},
                    methods: {
                        updateScript(value,id){
                            switch(id){
                                case "rotType":
                                    switch(value){
                                        case "None":
                                            delete this.blockData.blockShape;
                                            delete this.blockStates.facing;

                                            delete this.script.outsideData.blockShapes;
                                            delete this.runnables.blockstateGen.fourAxes;
                                            delete this.script.getStateOnPlace;
                                            delete this.script.getBlockShape;
                                            break;
                                        case "4 Axes":
                                            this.blockData.blockShape="script:getBlockShape";
                                            this.blockStates.facing={
                                                type: "enum",
                                                values: ["north","south","east","west"]
                                            }

                                            this.script.outsideData.blockShapes=(objToReturn,model)=>{
                                                let format=(shapes)=>{
                                                    let toReturn="{";
                                                    for(let cuboid of shapes){
                                                        toReturn+="{";
                                                        for(let i=0;i<5;i++)
                                                            toReturn+=cuboid[i]+",";
                                                        toReturn+=cuboid[5]+"},";
                                                    }
                                                    return toReturn.slice(0,-1)+"}";
                                                };
                                                let f180=(shapes)=>{
                                                    let toReturn=[];
                                                    for(let cuboid of shapes)
                                                        toReturn.push([
                                                            1-cuboid[3],cuboid[1],1-cuboid[5],
                                                            1-cuboid[0],cuboid[4],1-cuboid[2]
                                                        ]);
                                                    return toReturn;
                                                };
                                                let f90=(shapes)=>{
                                                    let toReturn=[];
                                                    for(let cuboid of shapes)
                                                        toReturn.push([
                                                            cuboid[2],cuboid[1],1-cuboid[3],
                                                            cuboid[5],cuboid[4],1-cuboid[0]
                                                        ]);
                                                    return toReturn;
                                                };

                                                //--

                                                let blockShapes=objToReturn.blockShape;
                                                objToReturn.blockShape=this.blockData.blockShape;

                                                //--

                                                let toAddModel={};

                                                //--

                                                return "local blockShapes = {\n"+
                                                `   north=${format(blockShapes)},\n`+
                                                `   south=${format(f180(blockShapes))},\n`+
                                                `   east=${format(f90(f180(blockShapes)))},\n`+
                                                `   west=${format(f90(blockShapes))}\n`+
                                                "}"
                                            };
                                            this.runnables.blockstateGen.fourAxes=(blockstate)=>{
                                                let model=blockstate.variants[""].model;

                                                blockstate.variants["facing=north"]={
                                                    model:model,
                                                    y:0
                                                };
                                                blockstate.variants["facing=east"]={
                                                    model:model,
                                                    y:90
                                                };
                                                blockstate.variants["facing=south"]={
                                                    model:model,
                                                    y:180
                                                };
                                                blockstate.variants["facing=west"]={
                                                    model:model,
                                                    y:270
                                                };

                                                delete blockstate.variants[""];
                                            };
                                            this.script.getStateOnPlace=
                                            "function getStateOnPlace(context)\n"+
                                            "   return {\n"+
                                            "       facing = context.getPlayerFacing().toString()\n"+
                                            "   }\n"+
                                            "end";
                                            this.script.getBlockShape=
                                            "function getBlockShape(state, world, pos, context)\n"+
                                            "   return blockShapes[Properties.get(state,\"facing\")]\n"+
                                            "end";

                                            //todo: resources qwq
                                            break;
                                    }
                                    break;
                            }
                        }
                    },
                    template: `<span class="list mobile_scrollbar">
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li><p>
                                Rotation type: <select @change="updateScript($event.target.value,'rotType')">
                                    <option v-for="enumValue of rotTypes">
                                        {{enumValue}}
                                    </option>
                                </select>
                            </p></li>
                        </ul>
                        <div id="scriptpreview"></div>
                        </span>
                    `
                },
            });
            scriptPanel=new Panel("script",{
                condition: {modes: ["properties"]},
                default_position: {
                    slot: 'right_bar',
                    float_position: [0, 0],
                    float_size: [300, 400],
                    height: 400
                },
                growable:true,
                component: {
                    name: 'panel-display',
                    data() {return {
                        script:"",
                    }},
                    methods: { },
                    template: `<p class="m3we-box" style="margin: 12px; padding: 12px;">coming soon</p>
                    `
                },
            });

            button = new Action('m3we_export', {
                name: 'Export M3WE Block',
                description: 'Export an M3WE block',
                icon: 'settings_input_component',
                click: function() {
                    if(!Group.all.find(group=>group.name=="collision")){
                        alert("Add a \"collision\" folder to your blockbench project, and add the block's collision inside of it first!");
                        return;
                    }

                    let objToReturn={};
                    for(let propName in blockProps)
                        if(blockProps[propName][4]!="noSerialize")
                            objToReturn[blockProps[propName][0]]=blockProps[propName][3];

                    for(let state of blockStates){
                        if(!objToReturn.blockStates) objToReturn.blockStates={};

                        let currBlockStateObj={
                            type:state.type,
                            default:state.def
                        };
                        if(state.type=="int"){
                            currBlockStateObj.min=state.min;
                            currBlockStateObj.max=state.max;
                        }else if(state.type=="enum"){
                            currBlockStateObj.values=[state.def].concat(state.values.filter(v=>v!=state.def));
                            delete currBlockStateObj.default;
                        }

                        objToReturn.blockStates[state.name]=currBlockStateObj;
                    }

                    objToReturn.blockShape=[];
                    Group.all.find(group=>group.name=="collision").children.forEach((cube)=>{
                        objToReturn.blockShape.push([cube.from[0]/16,cube.from[1]/16,cube.from[2]/16,
                            cube.to[0]/16,cube.to[1]/16,cube.to[2]/16]);
                    });

                    function protectChildren(folder){
                        folder.children.forEach((child)=>{
                            if(child.children){
                                protectChildren(child);
                            }else{
                                child.export=false;
                            }
                        });
                    }
                    //this filtering is not enough, subgroups still exist(?)
                    Group.all.filter((group)=>group.name=="collision").forEach((group)=>{
                        protectChildren(group);
                    });

                    //--

                    let model = JSON.parse(Codecs.java_block.compile());
                    delete model.groups;
                    model.credit+=" and Kyfex's M3WE Plugin";
                    if(model.textures){
                        Object.keys(model.textures).forEach((key)=>{
                            model.textures[key]=objToReturn.namespace+":"+model.textures[key]
                        });
                    }
                    model.parent="block/block";
                    function oneLinerArr(arr){
                        return {makeIntoOneLine_m3we:arr};
                    }
                    for(let element of model.elements){
                        element.from=oneLinerArr(element.from);
                        element.to=oneLinerArr(element.to);
                        for(let face of Object.values(element.faces)){
                            face.uv=oneLinerArr(face.uv);
                        }
                    }

                    //--

                    let script="-- made with the m3we plugin!\n\n";
                    let isScript=false;
                    for(let outsideDataFunc of Object.values(plugNPlayData.script.outsideData)){
                        script+=outsideDataFunc(objToReturn)+"\n\n";
                        isScript=true;
                    }

                    if(plugNPlayData.blockStates)
                        objToReturn.blockStates=
                            Object.assign(objToReturn.blockStates||{},plugNPlayData.blockStates);

                    script+="-- owo --\n\n";

                    for(let funcName of Object.keys(plugNPlayData.script)){
                        if(funcName=="outsideData") continue;

                        script+=plugNPlayData.script[funcName]+"\n\n";
                        isScript=true;
                    }

                    //--

                    objToReturn.createdBy="m3we_plugin";
                    let resourcePack = new JSZip();

                    let mainFolder = resourcePack.folder("assets").folder(objToReturn.namespace);

                    if(isScript){
                        mainFolder.file(objToReturn.blockName+"_script.lua",script);
                        objToReturn.script=objToReturn.blockName+"_script";
                    }
                    mainFolder.file("README.txt",readme(objToReturn.namespace,objToReturn.blockName));//todo: remove script if no script
                    mainFolder.file(objToReturn.blockName+"_block.json",JSON.stringify(objToReturn,null,2));
                    mainFolder.file(objToReturn.blockName+"_item.json",itemGen(objToReturn.namespace,objToReturn.blockName));

                    let oneLineArrays=[];
                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/models/block/`+objToReturn.blockName+".json", JSON.stringify(model,function(k,v){
                           if(v.makeIntoOneLine_m3we)
                                return "makeIntoOneLine_m3we"+(oneLineArrays.push(v.makeIntoOneLine_m3we)-1);
                           return v;
                        },2).replaceAll(/"makeIntoOneLine_m3we\d+"/g,match=>
                            JSON.stringify(oneLineArrays[match.slice("'makeIntoOneLine_m3we".length,-1)])));

                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/models/item/`+objToReturn.blockName+".json",
                        itemModel(objToReturn.namespace,objToReturn.blockName));

                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/blockstates/`+objToReturn.blockName+".json",
                        blockstateGen(objToReturn.namespace,objToReturn.blockName));

                    //todo: lang file

                    Texture.all.forEach((texture)=>{
                        //todo: check if texture already has extension
                        mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/textures/block/`+texture.name+".png",
                            texture.source.slice("data:image/png;base64,".length),{base64:true});
                    });
                    
                    mainFolder.generateAsync({type:"blob"})
                        .then(function (blob) {
                            saveAs(blob, objToReturn.namespace+"_"+objToReturn.blockName+".zip");
                        });

                }
            });
            MenuBar.addAction(button, 'file.export.0');
            
            propMode = new Mode("properties",{
                name:"Properties",
                category: "navigate",
                default_tool: "move_tool",
                center_windows: ["properties","plugNPlay"],
                selectCubes: false,
                component: {
                    data() {
                        return {

                        }
                    },
                    template: ``
                },
                condition: () => true,//need to change this so it only appears when working on designated m3we files
                onSelect: ()=>{},
                onUnselect: ()=>{}
            });
            Modes.vue.$forceUpdate();
            console.log("m3we plugin loaded");
        },
        onunload() {
            propsPanel.delete();
            plugNPlayPanel.delete();
            scriptPanel.delete();
            propMode.delete();
            button.delete();

            Modes.vue.$forceUpdate();

            console.log("m3we plugin unloaded");
        }
  });
})();
