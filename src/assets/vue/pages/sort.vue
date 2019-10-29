<template>
  <f7-page>
    <f7-navbar title="模式和排序">
      <f7-nav-right>
        <f7-link popup-close>关闭</f7-link>
      </f7-nav-right>
    </f7-navbar>

    <div class="col-6">
      <h5 style="padding-left: 10px">提示: 升温顺序(可以拖动进行调整)</h5>

      <draggable
        :list="list"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
        @start="dragging = true"
        @end="checkMove()"
      >
        <div class="list-group-item" v-for="item in list" :key="item.roomId">
          {{ item.remark }}
          <div style="float: right">
            <div
              style="color: teal"
              @click="changeMode(item.houseRoomInfo);"
            >{{modelTypeEnum(item.houseRoomInfo)}}</div>
            <div
              @click="goModeDetail(item.houseRoomInfo)"
              v-if="item.houseRoomInfo.modelType == 1"
              class="icon-settings"
            ></div>
          </div>
        </div>
      </draggable>
    </div>
    <f7-popup class="demo-popup" :opened="popupRoom" @popup:closed="popupRoom = false">
      <f7-page>
        <f7-navbar title="温控详情">
          <f7-nav-right>
            <f7-link @click="popupRoom= false">关闭</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <div>
          <div class="list media-list" style="margin-top: 0">
            <div style="padding: 15px; color: #888">周一至周五</div>
            <ul>
              <li class="media-item" v-for="(item, idx) in 4" :key="idx">
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">{{modeDetailData['time'+item]}}</div>
                      <div class="item-after">
                        <span>{{modeDetailData['temp'+item]}}°</span>
                        <span>
                          <f7-link
                            popover-open=".popover-menu"
                            v-if="modeDetailData.isEdit"
                            @click="editDetail(item)"
                          >
                            <i style="color: teal;" class="f7-icons">edit</i>
                          </f7-link>
                        </span>
                      </div>
                    </div>
                    <div class="item-subtitle">{{modeDetailData['starttime'+item]}}</div>
                  </div>
                </div>
              </li>
            </ul>
            <div style="padding: 15px; color: #888">周六周日</div>
            <ul>
              <li class="media-item" v-for="(item, idx) in 4" :key="idx">
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">{{modeDetailData['time'+Number(item+4)]}}</div>
                      <div class="item-after">
                        <span>{{modeDetailData['temp'+Number(item+4)]}}°</span>
                        <span>
                          <f7-link
                            popover-open=".popover-menu"
                            v-if="modeDetailData.isEdit"
                            @click="editDetail(Number(item+4))"
                          >
                            <i style="color: teal;" class="f7-icons">edit</i>
                          </f7-link>
                        </span>
                      </div>
                    </div>
                    <div class="item-subtitle">{{modeDetailData['starttime'+Number(item+4)]}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </f7-page>
    </f7-popup>
    <f7-popover class="popover-menu" :opened="true">
      <f7-list inline-labels no-hairlines-md>
        <f7-list-input
          label="名称"
          type="text"
          :value="condition.time"
          @input="condition.time = $event.target.value"
          placeholder="名称"
        ></f7-list-input>
        <f7-list-input
          label="开始时间"
          type="text"
          :value="condition.starttime"
          @input="condition.starttime = $event.target.value"
          placeholder="开始时间"
        ></f7-list-input>
        <f7-list-input
          label="温度"
          type="text"
          :value="condition.temp"
          @input="condition.temp = $event.target.value"
          placeholder="温度"
        ></f7-list-input>
      </f7-list>
      <div style="padding: 20px;">
        <f7-button popover-close style="background: teal; color: #fff;" round @click="saveTemp">保存</f7-button>
      </div>
    </f7-popover>
  </f7-page>
</template>

<script>
import draggable from "vuedraggable";
import global from "../../../global";
let id = 1;
export default {
  name: "simple",
  display: "Simple",
  order: 0,
  houseControlInfo: {},
  components: {
    draggable
  },
  data() {
    return {
      enabled: true,
      popupRoom: false,
      modeDetailData: {},
      list: [
      ],
      dragging: false,
      condition: {
        time: "",
        starttime: "",
        temp: "",
        num: ""
      } // 暂存温度
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    modelTypeEnum(child) {
      console.log(child)
      if (child.modelType == 0) {
        return "自由模式";
      } else if (child.modelType == 1) {
        return "编程模式";
      }
    },
        // 变更模式
    async changeMode(item) {
      if(this.houseControlInfo.controlMode == 1) {
        global.toast("分户住宅不能变更模式");
        return;  
      }
      console.log(item);
      this.loadingSwitch = true
      let res = await this.$axios({
        url: `app/heating/residentApp/getRoomModelList/${item.roomId}`,
        method: "get"
      });
      this.loadingSwitch = false
      let buttons = [];
      res.data.data.forEach(element => {
        const self = this;
        let text = "";
        if (element.isPresent == 0 && item.modelType == 1) {
          text =
            '<i style="color: teal" class="f7-icons">check</i>' +
            element.modelName;
        } else {
          text = element.modelName;
        }
        buttons.push({
          text,
          async onClick(val) {
            if (item.modelType == 0) {
              let resMode = await self.$axios({
                url: `app/heating/residentApp/changeRoomModel/${item.roomId}`,
                method: "get"
              });
              if (resMode.data.code == 200) {
                item.modelType = item.modelType == "0" ? "1" : "0";
              }
            }
            let res = await self.$axios({
              url: `app/heating/residentApp/applyModel/${item.roomId}/${element.modelId}`,
              method: "get"
            });
            console.log(element);
          }
        });
      });
      const self = this;
      const app = self.$f7;
      self.actionsToPopover = app.actions.create({
        buttons: [
          [
            {
              text: "自由模式",
              async onClick(val) {
                if (item.modelType == 1) {
                  let resMode = await self.$axios({
                    url: `app/heating/residentApp/changeRoomModel/${item.roomId}`,
                    method: "get"
                  });
                  if (resMode.data.code == 200) {
                    item.modelType = item.modelType == "0" ? "1" : "0";
                  }
                }
              }
            }
          ],
          buttons,
          [
            {
              text: "取消",
              color: "red"
            }
          ]
        ],
        targetEl: self.$el.querySelector(".button-to-popover")
      });
      self.actionsToPopover.open();
      // let res = await this.$axios({
      //   url: `app/heating/residentApp/changeRoomModel/${
      //     item.roomId
      //   }`,
      //   method: "get"
      // });
      // if (res.data.code == 200) {
      //   item.modelType = item.modelType == '0' ? '1' : '0'
      // }
    },
    async goModeDetail(item) {
      let res = await this.$axios({
        url: `app/heating/residentApp/getRoomModelList/${item.roomId}`,
        method: "get"
      });
      res.data.data.forEach(element => {
        if (element.isPresent == 0) {
          this.modeDetailData = element.details;
          if (element.modelFlag == 1) {
            this.modeDetailData.isEdit = true;
          }
        }
      });
      this.popupRoom = true;
    },
    async checkMove(e) {
      this.dragging = false;
      let temp = []
      console.log(this.list)
      this.list.forEach(n => {
        temp.push ({
          heatOrder: n.heatOrder,
          remark: n.remark,
          roomId: n.roomId
        })
      })
      try {
          let res = await this.$axios({
            url: "app/heating/residentApp/modifyRoomHeatOrder",
            method: "post",
            data: temp
          });
          global.toast(res.data.info);
        } catch (error) {}
    },
    editDetail(item) {
      this.condition.starttime = this.modeDetailData["starttime" + item];
      this.condition.time = this.modeDetailData["time" + item];
      this.condition.temp = this.modeDetailData["temp" + item];
      this.condition.num = item;
    },
    // 修改子模式中自定义模式
    async saveTemp() {
      if (this.condition.temp > 35) {
        global.toast("温度不能超过35度");
        return;
      }
      if (this.condition.temp < 5) {
        global.toast("温度不能低于5度");
        return;
      }
      this.modeDetailData[
        "starttime" + this.condition.num
      ] = this.condition.starttime;
      this.modeDetailData["time" + this.condition.num] = this.condition.time;
      this.modeDetailData["temp" + this.condition.num] = this.condition.temp;
      let res = await this.$axios({
        url: "app/heating/residentApp/modifyModelDetails",
        method: "post",
        data: this.modeDetailData
      });
    },
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding-right: 55px;
}
.icon-settings {
  width: 24px;
  height: 24px;
  background-image: url("../../images/sy2.png");
  background-size: 24px auto;
  background-repeat: no-repeat;
  margin-left: 5px;
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>