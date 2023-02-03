// https://cdn.jsdelivr.net/gh/kyfex-uwu/m3we-plugin@main/m3we-plugin.js
//plugin link

(function() {
    var button;
    var propsPanel;
    var plugNPlayPanel;
    var scriptPanel;

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

    const itemModel = (namespace, name)=>{
        return `{\n  \"parent\": \"${namespace}:block/${name}\"\n}`;
    };
    const itemGen = (namespace, name)=>{
        return JSON.stringify({
            namespace:namespace,
            itemName:name,
            blockToPlace:namespace+":"+name
        },null,2);
    }
    const readme=(namespace,block)=>{
        return "- Put the "+namespace+" folder in (minecraft folder)/config/m3we/resources so your block has visuals in game. (You can rename this folder, if you want)\n"+
            "- Put "+block+"_block.json file in (minecraft folder)/config/m3we/blocks so your block behaves correctly in game. (You can rename this file, too!)\n"+
            "- Put "+block+"_item.json file in (minecraft folder)/config/m3we/items so your block has an item attached to it. (If you rename this, the game will crash - just kidding, you can rename it too)\n"+
            "\nIf you have any questions email me at fox@kyfexuwu.com";
    };

    const blockstateGen=(namespace,block)=>{
        return JSON.stringify({
          "variants": {
            "": {
              "model": namespace+":block/"+block
            }
          }
        },null,2);
    }
    
    Plugin.register("m3we-plugin", {
        title: "M3WE Plugin",
        author: "KYFEX",
        description: "Tool for making M3WE asset creation even easier",
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

            propsPanel=new Panel("properties",{
                condition: {modes: ["properties"]},
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
                        properties:[
                            ["namespace","text","namespace","m3we"],
                            ["blockName","text","blockName","name"],
                            ["material","enum","material","STONE",materials],
                            ["hardness","number","float",0.0],
                            ["resistance","number","float",0.0],
                            ["slipperiness","number","float",0.6],
                            ["jumpMultiplier","number","float",1.0],
                            ["speedMultiplier","number","float",1.0],
                            ["sounds","enum","sound","STONE",sounds],
                            ["isOpaque","checkbox","bool",true],
                            ["luminance","number","integer", 0],//or script
                            ["mapColor","enum","mapColor","CLEAR",colors],
                            ["drops","enum","dropTable","EMPTY",["coming soon"]],
                            ["isToolRequired","checkbox","bool",false],
                            ["ticksRandomly","checkbox","bool",false],
                            ["isAir","checkbox","bool",false],
                            ["isCollidable","checkbox","bool",true],
                            ["blockCollisionCanResize","checkbox","bool",false],
                            ["isSolidWhen","checkbox","boolOrScript", true],//or script
                            ["allowsSpawningWhen","checkbox","boolOrScript", true],//or script
                            ["visionBlockedWhen","checkbox","boolOrScript", false],//or script
                            ["suffocatesWhen","checkbox","boolOrScript", false],//or script
                            ["emissiveLightingWhen","checkbox","boolOrScript", false],//or script
                            ["postProcessWhen","checkbox","boolOrScript", false],//or script
                        ],
                        blockStates:0,

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
                        addBlockState(parent){
                            let blockStateId=this.blockStates;
                            let newBlockState = document.createElement("li");
                            newBlockState.id="blockState"+blockStateId;
                            newBlockState.style="margin-left:12px;";
                            newBlockState.innerHTML=`
                                Blockstate <input class="m3we-box dark_bordered"
                                value="blockstate"
                                style="margin-right:5px;">
                            <ul style="margin-left:12px;">
                                <li>Type:<select name="defaultvalue" class="m3we-box dark_bordered" onchange="`+
                                    `this.parentNode.parentNode.setAttribute('isInt',this.value=='int')">
                                    <option value="int">Integer</option>
                                    <option value="bool">Boolean</option>
                                    <option value="direction">Direction</option>
                                    <!--<option value="enum">Enum</option>-->
                                </select></li>
                                <li>Default Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                                <li integer>Max Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                                <li integer>Min Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                            </ul>
                            `;

                            this.blockStates++;
                            parent.insertBefore(newBlockState, parent.children[this.properties.length]);
                        },
                    },
                    //tl("translation.path") translates text
                    template: `
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li v-for="(property,index) of properties">
                                <p v-if="property[1]=='checkbox'" style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <input :id="'property'+index" 
                                    :checked="property[3]?true:null" :type="property[1]"
                                    @change="$event.target.parentNode.children[1].innerText=$event.target.checked?'ALWAYS':'NEVER'"
                                    style="margin-left:5px; margin-right:5px;">
                                    <span v-if="property[2]=='boolOrScript'">{{property[3]?"ALWAYS":"NEVER"}}</span>
                                </p>
                                <p v-else-if="property[1]=='enum'" style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <select :id="'property'+index">
                                        <option v-for="enumValue of property[4]">
                                            {{enumValue}}
                                        </option>
                                    </select>
                                </p>
                                <p v-else style="display:flex;">
                                    {{propToReadable(property[0])}}:

                                    <input :id="'property'+index" class="m3we-box dark_bordered"
                                    :value="property[3]" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px; flex-grow: 1; flex-shrink: 1;">
                                </p>
                            </li>
                            <br>
                            <li>
                            <button @click="addBlockState(_self.$el)">Add Blockstate</button>
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
                    data() {return {
                        rotTypes:["None","4 Axes"],

                        script:{
                            getStateOnPlace:false,
                        },
                    }},
                    methods: {
                        updateScript(value,id){
                            switch(id){
                                case "rotType":
                                    switch(value){
                                        case "None":
                                            console.log(script.getStateOnPlace);
                                    }
                                    break;
                            }
                        }
                    },
                    template: `<span class="list mobile_scrollbar">
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li><p>
                                Rotation type: <select>
                                    <option v-for="enumValue of rotTypes"
                                        @change="updateScript($event.target.value,'rotType')">
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
                    template: `<p class="m3we-box" style="margin: 12px;"></p>
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
                    propsPanel.vue.properties.forEach((propData, index)=>{
                        let currInput = document.getElementById("property"+index);
                        objToReturn[propData[0]]=currInput.value;
                        if(propData[1]=="checkbox") objToReturn[propData[0]]=currInput.checked;
                    });

                    let currBlockState=0;
                    let currBSElement;
                    while(currBSElement=document.getElementById("blockState"+currBlockState)){
                        if(currBlockState==0)
                            objToReturn.blockStates={};

                        let BSData=currBSElement.children[1].children;
                        let currBlockStateObj={
                            type:BSData[0].children[0].value,
                            default:BSData[1].children[0].value
                        };
                        if(currBlockStateObj.type=="int"){
                            currBlockStateObj.min=BSData[2].children[0].value;
                            currBlockStateObj.max=BSData[3].children[0].value;
                        }

                        objToReturn.blockStates[currBSElement.children[0].value]=currBlockStateObj;
                        currBlockState++;
                    }

                    objToReturn.blockShape=[];
                    Group.all.find(group=>group.name=="collision").children.forEach((cube)=>{
                        objToReturn.blockShape.push([cube.from[0]/16,cube.from[1]/16,cube.from[2]/16,
                            cube.to[0]/16,cube.to[1]/16,cube.to[2]/16]);
                    });

                    objToReturn.createdBy="m3we_plugin";

                    //--

                    let resourcePack = new JSZip();

                    let mainFolder = resourcePack.folder("assets").folder(objToReturn.namespace);
                    mainFolder.file("README.txt",readme(objToReturn.namespace,objToReturn.blockName));
                    mainFolder.file(objToReturn.blockName+"_block.json",JSON.stringify(objToReturn,null,2));
                    mainFolder.file(objToReturn.blockName+"_item.json",itemGen(objToReturn.namespace,objToReturn.blockName));

                    function protectChildren(folder){
                        folder.children.forEach((child)=>{
                            if(child.children){
                                protectChildren(child);
                            }else{
                                child.export=false;
                            }
                        });
                    }
                    //this filtering is not enough, groups still exist
                    Group.all.filter((group)=>group.name=="collision").forEach((group)=>{
                        protectChildren(group);
                    });
                    let model = JSON.parse(Codecs.java_block.compile());
                    model.credit+=" and Kyfex's M3WE Plugin";
                    Object.keys(model.textures).forEach((key)=>{
                        model.textures[key]=objToReturn.namespace+":block/"+model.textures[key]
                    });
                    model.parent="block/block";
                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/models/block/`+objToReturn.blockName+".json", JSON.stringify(model,null,2));
                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/models/item/`+objToReturn.blockName+".json",
                        itemModel(objToReturn.namespace,objToReturn.blockName));

                    mainFolder.file(`${objToReturn.namespace}/assets/${objToReturn.namespace}/blockstates/`+objToReturn.blockName+".json",
                        blockstateGen(objToReturn.namespace,objToReturn.blockName));

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

            
            new Mode("properties",{
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
        },
        onunload() {
            delete Panels.properties;
            delete Panels.plugNPlay;
            delete Panels.script;

            delete Modes.options.properties;
            Modes.vue.$forceUpdate();

            button.delete();
            console.log("m3we plugin uninstalled");
        }
  });
})();
