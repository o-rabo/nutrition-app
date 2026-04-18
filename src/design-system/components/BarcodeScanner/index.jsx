import { useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../Icon'

const FRAME = 260
const CORNER = 28
const THICK = 3
const CORNER_COLOR = '#6acc7e'
const CLOSE_BTN_INSET = 16

function CornerMarkers() {
  const common = {
    backgroundColor: CORNER_COLOR,
    position: 'absolute',
  }
  return (
    <>
      <View
        style={[
          common,
          {
            top: 0,
            left: 0,
            width: CORNER,
            height: THICK,
            borderTopLeftRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            top: 0,
            left: 0,
            width: THICK,
            height: CORNER,
            borderTopLeftRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            top: 0,
            right: 0,
            width: CORNER,
            height: THICK,
            borderTopRightRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            top: 0,
            right: 0,
            width: THICK,
            height: CORNER,
            borderTopRightRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            bottom: 0,
            left: 0,
            width: CORNER,
            height: THICK,
            borderBottomLeftRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            bottom: 0,
            left: 0,
            width: THICK,
            height: CORNER,
            borderBottomLeftRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            bottom: 0,
            right: 0,
            width: CORNER,
            height: THICK,
            borderBottomRightRadius: 3,
          },
        ]}
      />
      <View
        style={[
          common,
          {
            bottom: 0,
            right: 0,
            width: THICK,
            height: CORNER,
            borderBottomRightRadius: 3,
          },
        ]}
      />
    </>
  )
}

function BarcodeScanner({ visible, onClose, onScan }) {
  const insets = useSafeAreaInsets()
  const scanned = useRef(false)
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    if (!visible) {
      scanned.current = false
    }
  }, [visible])

  const handleBarcodeScanned = (result) => {
    if (scanned.current) return
    scanned.current = true
    if (result?.data) {
      onScan?.(result.data)
    }
  }

  const granted = permission?.granted

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
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
          <View style={[StyleSheet.absoluteFill, styles.permissionFallback]} />
        )}

        <View style={styles.overlay} pointerEvents="box-none">
          {!granted ? (
            <View style={styles.permissionMessage}>
              <Text style={styles.permissionText}>
                Camera access is needed to scan barcodes.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>
                  Allow camera access
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.closeBtn,
              { top: insets.top + 8, right: CLOSE_BTN_INSET },
            ]}
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close scanner"
          >
            <Icon name="close" size={28} color="#ffffff" />
          </TouchableOpacity>

          {granted ? (
            <View style={styles.overlayColumn} pointerEvents="box-none">
              <View
                style={[
                  styles.topOverlay,
                  { paddingTop: insets.top + 12 },
                ]}
              >
                <View style={styles.dragHandle} />
                <Text style={styles.scanTitle}>Scan barcode</Text>
              </View>

              <View style={styles.middleRow}>
                <View style={styles.sideDim} />
                <View style={styles.frame}>
                  <CornerMarkers />
                </View>
                <View style={styles.sideDim} />
              </View>

              <View style={styles.bottomSection}>
                <View style={styles.bottomActionBar}>
                  <Pressable style={styles.actionItem}>
                    <View style={styles.actionCircle}>
                      <Icon name="pencil" size={24} color="#6acc7e" />
                    </View>
                    <Text style={styles.actionLabel}>Manual</Text>
                  </Pressable>
                  <Pressable style={styles.actionItem}>
                    <View style={styles.actionCircle}>
                      <Icon name="gallery" size={24} color="#6acc7e" />
                    </View>
                    <Text style={styles.actionLabel}>Gallery</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionFallback: {
    backgroundColor: '#0d2215',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayColumn: {
    flex: 1,
  },
  permissionMessage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 2,
  },
  permissionText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#1e4d2b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#6acc7e',
    fontSize: 16,
    fontWeight: '500',
  },
  closeBtn: {
    position: 'absolute',
    zIndex: 10,
    padding: 4,
  },
  topOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 16,
  },
  scanTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  middleRow: {
    flexDirection: 'row',
    height: FRAME,
  },
  sideDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  frame: {
    width: FRAME,
    height: FRAME,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgba(13,27,23,0.95)',
    justifyContent: 'flex-end',
  },
  bottomActionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 40,
    gap: 32,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e4d2b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
})

export { BarcodeScanner }
export default BarcodeScanner
