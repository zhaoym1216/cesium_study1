<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import "../../node_modules/cesium/Source/Widgets/widgets.css";

export default {
  name: "Cesium",
  data() {
    return {
      viewer: null,
      redBox: null,
      ellipse: null,
      ship: null,
    };
  },
  mounted() {
    this.cesiumInit();
    // this.addBox();
    // this.addEllipse(); //纹理测试
    this.addShip();
  },
  methods: {
    cesiumInit() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2RjODQxYy0xNDI0LTRmNmYtOTJjNy02Njk3NGFmNGZlMzMiLCJpZCI6ODg1MTgsImlhdCI6MTY0OTI1MzIzNn0._0nz9pC6RF2dXjkzTilweCdZOP6jE-9Efc1QqjMOR_Q";
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        //   geocoder: false,
        //   homeButton: false,
        sceneModePicker: false,
        // infobox: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        //   animation: false,
        //   timeline: false,
        fullscreenButton: false,
        vrButton: false,
      });
      // 提示错误Blocked script execution in ‘about:blank’ because the document’s frame is sandboxed and the ‘allow-scripts’ permission is not set.的解决方法
      let iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
      iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
      );
      iframe.setAttribute("src", ""); //必须设置src为空 否则不会生效
      this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
      this.viewer.scene.debugShowFramesPerSecond = true; //显示帧数
      // 不显示星空且背景透明
      this.viewer.scene.skyBox.show = true;
      this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.5);
      // 视角大小
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
      // 显示阴影
      this.viewer.scene.globe.enableLighting = true;
      this.viewer.shadows = true;
      this.viewer.clock.multiplier = 1000;
      this.viewer.imageryLayers.get(0).show = false; //不显示底图
      this.viewer.scene.globe.baseColor = Cesium.Color.WHITE; //设置地球颜色
      // 设置home在中国(左下角，右上角)
      // const ChinaRectangle = Cesium.Rectangle.fromDegrees(
      //   119.080032,
      //   30.959241,
      //   122.789387,
      //   32.389027
      // );
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = ChinaRectangle;
      // this.viewer.camera.flyHome(8);
    },
    addShip() {
      // gltf模型
      // this.ship = this.viewer.entities.add({
      //   name: "ship",
      //   position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 1000),
      //   model: {
      //     uri: "model/ship/lunchuan.gltf",
      //     minimumPixelSize: 1280,
      //     maximumScale: 90000,
      //   },
      // });
      this.ship = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(75343),
        shadows: Cesium.ShadowMode.CAST_ONLY,
      });

      this.viewer.scene.primitives.add(this.ship);
      var defaultStyle = new Cesium.Cesium3DTileStyle({
        color: "color('gray', 0.02)", // 让建筑变透明
        show: true,
      });
      this.ship.style = defaultStyle;
      // Set the initial camera view to look at Manhattan
      const initialPosition = Cesium.Cartesian3.fromDegrees(
        -74.01881302800248,
        40.69114333714821,
        753
      );
      const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
        21.27879878293835,
        -21.34390550872461,
        0.0716951918898415
      );
      this.viewer.scene.camera.setView({
        destination: initialPosition,
        orientation: initialOrientation,
        endTransform: Cesium.Matrix4.IDENTITY,
      });
    },
    addBox() {
      this.redBox = this.viewer.entities.add({
        name: "Red box with black outline",
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 25000.0),
        box: {
          dimensions: new Cesium.Cartesian3(40000.0, 30000.0, 50000.0),
          material: Cesium.Color.RED.withAlpha(0.05),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          shadows: Cesium.ShadowMode.CAST_ONLY,
        },
      });
      this.viewer.zoomTo(this.viewer.entities);
    },
    addEllipse() {
      //方法一，构造时赋材质
      this.ellipse = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          // material: Cesium.Color.BLUE.withAlpha(0.5), //可设置不同的MaterialProperty
          // 棋盘纹理
          // material: new Cesium.CheckerboardMaterialProperty({
          //   evenColor: Cesium.Color.BLACK,
          //   oddColor: Cesium.Color.WHITE,
          //   repeat: new Cesium.Cartesian2(4, 4),
          // }),
          // 网格
          material: new Cesium.GridMaterialProperty({
            color: Cesium.Color.YELLOW,
            cellAlpha: 0.2,
            lineCount: new Cesium.Cartesian2(8, 8),
            lineThickness: new Cesium.Cartesian2(2.0, 2.0),
          }),
        },
      });
      // ellipse.material = new Cesium.GridMaterialProperty({
      //   color: Cesium.Color.YELLOW,
      //   cellAlpha: 0.2,
      //   lineCount: new Cesium.Cartesian2(8, 8),
      //   lineThickness: new Cesium.Cartesian2(2.0, 2.0),
      // });
      //完整的这么写
      // ellipse.material = new Cesium.ImageMaterialProperty({
      //   image: "../images/cats.jpg",
      //   color: Cesium.Color.BLUE,
      //   repeat: new Cesium.Cartesian2(4, 4),
      // });

      // //也可以简单的写成
      // ellipse.material = "../images/cats.jpg";
      // 棋盘纹理
      // this.ellipse.material = new Cesium.CheckerboardMaterialProperty({
      //   evenColor: Cesium.Color.BLACK,
      //   oddColor: Cesium.Color.WHITE,
      //   repeat: new Cesium.Cartesian2(4, 4),
      // });
      // 条纹纹理
      // this.ellipse.material = new Cesium.StripeMaterialProperty({
      //   evenColor: Cesium.Color.WHITE,
      //   oddColor: Cesium.Color.BLUE,
      //   repeat: 32,
      //   offset: 20,
      //   orientation: Cesium.StripeOrientation.VERTICAL,
      // });
      this.viewer.zoomTo(this.viewer.entities);
    },
  },
};
</script>

<style >
#container {
  padding: 0%;
  margin: 0%;
}
#cesiumContainer {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.box {
  height: 100%;
}
</style>