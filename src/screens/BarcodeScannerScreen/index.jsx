import { useEffect, useRef, useCallback } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '../../design-system/tokens'
import { Icon } from '../../design-system/components/Icon'

const T = 3
const L = 24
const C = 8
const r2 = 2

function LCornerTopLeft() {
  const a = { backgroundColor: colors.accent.icon }
  return (
    <View
      style={{
        position: 'absolute',
        top: C,
        left: C,
        width: L,
        height: L,
      }}
    >
      <View
        style={[
          a,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: L,
            height: T,
            borderTopLeftRadius: r2,
          },
        ]}
      />
      <View
        style={[
          a,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: T,
            height: L,
            borderBottomLeftRadius: r2,
          },
        ]}
      />
    </View>
  )
}

function LCornerTopRight() {
  const a = { backgroundColor: colors.accent.icon }
  return (
    <View
      style={{
        position: 'absolute',
        top: C,
        right: C,
        width: L,
        height: L,
      }}
    >
      <View
        style={[
          a,
          {
            position: 'absolute',
            top: 0,
            right: 0,
            width: L,
            height: T,
            borderTopRightRadius: r2,
          },
        ]}
      />
      <View
        style={[
          a,
          {
            position: 'absolute',
            top: 0,
            right: 0,
            width: T,
            height: L,
            borderBottomRightRadius: r2,
          },
        ]}
      />
    </View>
  )
}

function LCornerBottomLeft() {
  const a = { backgroundColor: colors.accent.icon }
  return (
    <View
      style={{
        position: 'absolute',
        bottom: C,
        left: C,
        width: L,
        height: L,
      }}
    >
      <View
        style={[
          a,
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: L,
            height: T,
            borderBottomLeftRadius: r2,
          },
        ]}
      />
      <View
        style={[
          a,
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: T,
            height: L,
            borderTopLeftRadius: r2,
          },
        ]}
      />
    </View>
  )
}

function LCornerBottomRight() {
  const a = { backgroundColor: colors.accent.icon }
  return (
    <View
      style={{
        position: 'absolute',
        bottom: C,
        right: C,
        width: L,
        height: L,
      }}
    >
      <View
        style={[
          a,
          {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: L,
            height: T,
            borderBottomRightRadius: r2,
          },
        ]}
      />
      <View
        style={[
          a,
          {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: T,
            height: L,
            borderTopRightRadius: r2,
          },
        ]}
      />
    </View>
  )
}

function FrameLCorners() {
  return (
    <>
      <LCornerTopLeft />
      <LCornerTopRight />
      <LCornerBottomLeft />
      <LCornerBottomRight />
    </>
  )
}

const { width: screenWidth, height: screenHeight } =
  Dimensions.get('window')

const SHEET_HEIGHT = screenHeight * 0.67
const cameraSquareWidth = screenWidth - (spacing[2.5] * 4)

function BarcodeScanner({ visible, onClose, onScan }) {
  const scanned = useRef(false)
  const [permission, requestPermission] = useCameraPermissions()
  const translateY = useRef(new Animated.Value(0)).current
  const lastDragY = useRef(0)

  useEffect(() => {
    if (!visible) {
      scanned.current = false
    }
  }, [visible])

  useEffect(() => {
    if (!visible) {
      translateY.setValue(0)
    }
  }, [visible, translateY])

  const handleBarcodeScanned = (result) => {
    if (scanned.current) return
    scanned.current = true
    if (result?.data) {
      onScan?.(result.data)
    }
  }

  const onSheetGesture = useCallback(
    (e) => {
      const t = e.nativeEvent.translationY
      const y = t > 0 ? t : 0
      lastDragY.current = y
      translateY.setValue(y)
    },
    [translateY],
  )

  const onSheetStateChange = useCallback(
    (e) => {
      if (e.nativeEvent.state === State.END) {
        const y = lastDragY.current > 0 ? lastDragY.current : 0
        if (y > 100) {
          onClose?.()
        } else {
          lastDragY.current = 0
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
            tension: 200,
          }).start()
        }
      }
    },
    [onClose, translateY],
  )

  const sheetStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    width: '100%',
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    overflow: 'hidden',
  }

  const sheetAnimated = {
    ...sheetStyle,
    transform: [{ translateY }],
  }

  const granted = permission?.granted

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="Close scanner"
      />
      <PanGestureHandler
        onGestureEvent={onSheetGesture}
        onHandlerStateChange={onSheetStateChange}
        activeOffsetY={10}
      >
        <Animated.View style={sheetAnimated}>
          <View style={styles.dragHandle} />
          <Text
            style={styles.scanTitle}
            numberOfLines={1}
          >
            Scan barcode
          </Text>
          <View
            style={styles.cameraSection}
            pointerEvents="box-none"
          >
            <View
              style={styles.cameraFrame}
            >
              {granted ? (
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: [
                      'ean13',
                      'ean8',
                      'upc_a',
                      'upc_e',
                      'code128',
                      'code39',
                      'itf14',
                      'codabar',
                    ],
                  }}
                  onBarcodeScanned={handleBarcodeScanned}
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.cameraPlaceholder,
                  ]}
                />
              )}

              {!granted ? (
                <View style={styles.permissionInFrame}>
                  <Text style={styles.permissionText}>
                    Camera access is needed to scan barcodes.
                  </Text>
                  <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                    accessibilityRole="button"
                    accessibilityLabel="Allow camera access"
                  >
                    <Text style={styles.permissionButtonText}>
                      Allow camera access
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                >
                  <FrameLCorners />
                </View>
              )}
            </View>
          </View>
          <View
            style={styles.bottomActionBar}
            pointerEvents="box-none"
          >
            <View style={styles.actionRow}>
              <Pressable style={styles.actionItem}>
                <View
                  style={styles.actionCircle}
                >
                  <Icon
                    name="pencil"
                    size={24}
                    color={colors.accent.glow}
                  />
                </View>
                <Text style={styles.actionLabel}>
                  Manual
                </Text>
              </Pressable>
              <Pressable style={styles.actionItem}>
                <View
                  style={styles.actionCircle}
                >
                  <Icon
                    name="gallery"
                    size={24}
                    color={colors.accent.glow}
                  />
                </View>
                <Text style={styles.actionLabel}>
                  Gallery
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.overlay,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.text.ghost,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing[1.5],
    marginBottom: spacing[1.5],
  },
  scanTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  cameraSection: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: spacing[2.5] * 2,
    justifyContent: 'center',
  },
  cameraFrame: {
    width: cameraSquareWidth,
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
  },
  cameraPlaceholder: {
    backgroundColor: colors.primitives.green[800],
  },
  permissionInFrame: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    backgroundColor: colors.background.overlay,
    zIndex: 2,
  },
  permissionText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  permissionButton: {
    backgroundColor: colors.primitives.green[600],
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.lg,
  },
  permissionButtonText: {
    color: colors.accent.glow,
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
  },
  bottomActionBar: {
    paddingTop: spacing[1],
    paddingBottom: spacing[3.5],
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  actionItem: {
    alignItems: 'center',
    gap: spacing[1],
  },
  actionCircle: {
    width: spacing[7],
    height: spacing[7],
    borderRadius: borderRadius.full,
    backgroundColor: colors.primitives.green[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.secondary,
  },
})

function BarcodeScannerScreen() {
  const navigation = useNavigation()
  return (
    <View style={local.screenRoot}>
      <BarcodeScanner
        visible
        onClose={() => navigation.goBack()}
        onScan={() => {
          navigation.goBack()
        }}
      />
    </View>
  )
}

const local = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
})

export { BarcodeScanner, BarcodeScannerScreen }
export default BarcodeScannerScreen