import QtQuick 2.7
import QtQuick.Window 2.2
import QtQuick.Controls 2.1
import QtGraphicalEffects 1.0
//import QtApplicationManager.SystemUI 2.0

Window {
    id: main
    visible: true
    width: 1920
    height: 1080
    flags: Qt.Window | Qt.FramelessWindowHint
    title: qsTr("Nadva Desktop")
    Rectangle {
        id: container
        width: parent.width; height: parent.height
        AnimatedImage {
            id: boot
            width: parent.width
            height:parent.height
            source: "Assets/boot.gif"
            paused: if(currentFrame == 140)
                        true
                    else
                        false
        }
        /*
        Rectangle {
            id: topL_resize
            width: 2
            height: 2
            color: "transparent"
        }
        Rectangle {
            id: topR_resize
            width: 2
            height: 2
            color: "transparent"
            anchors.right: parent.right
        }
        Rectangle {
            id: botL_resize
            width: 2
            height: 2
            color: "transparent"
            anchors.bottom: parent.bottom
        }
        Rectangle {
            id: botR_resize
            width: 10
            height: 10
            x: 300
            y: 210
            color: "red"
            //anchors.bottom: parent.bottom
            //anchors.right: parent.right
            MouseArea {
                anchors.fill: parent
                drag.target: parent
                drag.minimumX: 10
                drag.maximumX: container.width
                drag.minimumY: 10
                drag.maximumY: container.height
            }
            //Component.onCompleted: {
                //   appwindow.w = x - parent.x
                // appwindow.h = y - parent.y
            //}
        }
    */
        Rectangle {
            id: appwindow
            visible: boot.paused
            /*
            property bool fullscreen: if(move.drag.active == false) and (y<=0)
                    true
                else
                    false
            */
            property string colorKey
            width: 1280
            height: 800
            color: "transparent"
            radius: 10
            //opacity: 1 - x/1000
            property bool rounded: true
            property bool adapt: true
            property int toolbar_size: 50
            clip: true
            /*
            layer.enabled: rounded
            layer.effect: OpacityMask {
                maskSource: Item {
                    width: appwindow.width
                    height: appwindow.height
                    Rectangle {
                        id: roundwin
                        anchors.centerIn: parent
                        width: appwindow.adapt ? appwindow.width : Math.min(appwindow.width, appwindow.height)
                        height: appwindow.adapt ? appwindow.height : width
                        radius: appwindow.radius
                    }
                }
            }
            */
            Rectangle {
                id: toolbar
                radius: parent.radius
                width: parent.width
                height: parent.toolbar_size*2
                property int spacing: 10
                color: "#000000"
                opacity: 0.8
                //Drag.keys: [ parent.colorKey ]
                Rectangle{
                    id: window_actions
                    width: parent.height *(9/8)
                    height: parent.height / 3
                    anchors.horizontalCenter: parent.right
                    anchors.horizontalCenterOffset: -width/2- parent.spacing
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.verticalCenterOffset: -height * (5/7)
                    radius: 5
                    color: "#1AFFFFFF"
                    //opacity: 0.2
                    Image{
                        id: close
                        source: "Assets/Avdan OS Icons/PNG/close.png"
                        width: parent.height* (2/3)
                        height: parent.height* (2/3)
                        anchors.horizontalCenter: parent.right
                        anchors.horizontalCenterOffset: -width
                        anchors.verticalCenter: parent.verticalCenter
                        //Component.onCompleted: console.log(parent.right)
                        Image{
                            id: minimize
                            source: "Assets/Avdan OS Icons/PNG/minimize.png"
                            width: parent.height
                            height: parent.height
                            anchors.horizontalCenter: parent.left
                            anchors.horizontalCenterOffset: -width
                            anchors.verticalCenter: parent.verticalCenter
                            Image{
                                id: expand
                                source: "Assets/Avdan OS Icons/PNG/expand.png"
                                width: parent.height
                                height: parent.height
                                anchors.horizontalCenter: parent.left
                                anchors.horizontalCenterOffset: -width
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
                MouseArea {
                    id: move
                    anchors.fill: parent
                    drag.target: appwindow
                    drag.minimumX: -parent.width+2
                    drag.maximumX: container.width - 2
                    drag.minimumY: -parent.height+parent.radius+2
                    drag.maximumY: container.height - 2
                }
            }
            Rectangle {
                id: app
                width: parent.width
                height: parent.height-parent.toolbar_size
                //color: "#00FF00"
                radius: parent.radius
                anchors.bottom: parent.bottom
                gradient: Gradient { 		//replace this with the app (this is some kind of demo)
                    GradientStop { position: 1.0; color: "lightgreen" }
                        GradientStop { position: 0.0; color: "green" }
                }
            }
        }
        Rectangle {
            id: taskbar
            visible: boot.paused
            property int taskbarOffx: 400
            width: parent.width-taskbarOffx
            height: 64
            color: "#000000"
            opacity: 0.8
            radius: 10
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.verticalCenter: parent.bottom
            anchors.verticalCenterOffset: -40
        }
        DropArea {
            id: dragTarget
            property string colorKey
            property alias dropProxy: dragTarget
            width: 64; height: 64
            //keys: [ colorKey ]
            Rectangle {
                id: dropRectangle
                anchors.fill: parent
                color: dragTarget.colorKey
                states: [
                    State {
                        when: dragTarget.containsDrag
                        PropertyChanges {
                            target: dropRectangle
                            color: "grey"
                        }
                    }
                ]
            }
        }
    }
}
