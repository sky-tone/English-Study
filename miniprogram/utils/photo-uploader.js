/**
 * photo-uploader.js - 练习资料拍照上传工具
 *
 * 功能：
 * 1. 拍照或从相册选择练习资料图片
 * 2. 本地存储管理（Phase 1 使用本地存储，Phase 2 接入云存储）
 * 3. 图片列表查询、删除
 *
 * 使用场景：
 * - 家长拍照上传孩子的纸质练习资料
 * - 教师拍照上传练习题、试卷等教学资料
 */

// 本地存储键名前缀
const STORAGE_KEY_PREFIX = 'uploaded_photos_';

// 默认配置
const DEFAULT_CONFIG = {
  maxPhotos: 9,           // 单次最多选择张数
  maxSizeKB: 10240,       // 单张最大 10MB
  storageKeySuffix: 'default'
};

/**
 * 选择并保存练习资料照片
 * 支持拍照和从相册选择
 *
 * @param {Object} options - 配置选项
 * @param {string} options.role - 角色标识 ('parent' | 'teacher')
 * @param {number} [options.maxPhotos=9] - 最多选择张数
 * @returns {Promise<Object>} 结果对象 { success, photos, message }
 */
function choosePhoto(options = {}) {
  const role = options.role || 'default';
  const maxPhotos = options.maxPhotos || DEFAULT_CONFIG.maxPhotos;
  const storageKey = STORAGE_KEY_PREFIX + role;

  // 计算还能上传多少张
  const existing = getPhotos(role);
  const remaining = Math.max(0, maxPhotos - existing.length);

  if (remaining <= 0) {
    return Promise.resolve({
      success: false,
      photos: [],
      message: `最多只能上传 ${maxPhotos} 张照片，请先删除部分照片`
    });
  }

  return ensureCameraAuth().then(() => {
    return new Promise((resolve) => {
      wx.chooseMedia({
        count: remaining,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        camera: 'back',
        success: (res) => {
          const newPhotos = res.tempFiles.map(file => ({
            id: generatePhotoId(),
            path: file.tempFilePath,
            size: file.size,
            timestamp: Date.now(),
            role: role
          }));

          // 追加到本地存储
          const allPhotos = [...existing, ...newPhotos];
          wx.setStorageSync(storageKey, allPhotos);

          resolve({
            success: true,
            photos: newPhotos,
            message: `成功添加 ${newPhotos.length} 张照片`
          });
        },
        fail: (err) => {
          // 用户取消选择不算错误
          if (err.errMsg && err.errMsg.includes('cancel')) {
            resolve({
              success: false,
              photos: [],
              message: ''
            });
          } else {
            resolve({
              success: false,
              photos: [],
              message: '选择照片失败，请重试'
            });
          }
        }
      });
    });
  });
}

/**
 * 确保摄像头权限已授权
 * 检查 scope.camera 状态，若未授权则请求授权，若已拒绝则引导用户到设置页重新开启
 * @returns {Promise<void>}
 */
function ensureCameraAuth() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        const cameraAuth = res.authSetting['scope.camera'];
        if (cameraAuth === true) {
          // 已授权
          resolve();
        } else if (cameraAuth === false) {
          // 曾经拒绝过，引导用户到设置页开启
          wx.showModal({
            title: '需要摄像头权限',
            content: '您之前拒绝了摄像头权限，请在设置中重新开启，以便拍照上传练习资料。',
            confirmText: '去设置',
            cancelText: '仅相册',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.camera']) {
                      resolve();
                    } else {
                      // 用户在设置页仍未开启，仍然 resolve 以允许仅使用相册
                      resolve();
                    }
                  },
                  fail: () => {
                    resolve();
                  }
                });
              } else {
                // 用户选择仅相册，仍然 resolve 让 chooseMedia 继续（仅相册不需要 camera 权限）
                resolve();
              }
            },
            fail: () => {
              resolve();
            }
          });
        } else {
          // 从未请求过（undefined），wx.chooseMedia 会自动弹出授权对话框
          resolve();
        }
      },
      fail: () => {
        // getSetting 失败，仍然尝试 chooseMedia
        resolve();
      }
    });
  });
}

/**
 * 获取已上传的照片列表
 * @param {string} role - 角色标识 ('parent' | 'teacher')
 * @returns {Array} 照片对象列表
 */
function getPhotos(role) {
  const storageKey = STORAGE_KEY_PREFIX + (role || 'default');
  const photos = wx.getStorageSync(storageKey);
  return Array.isArray(photos) ? photos : [];
}

/**
 * 删除指定照片
 * @param {string} role - 角色标识 ('parent' | 'teacher')
 * @param {string} photoId - 照片 ID
 * @returns {Object} 结果 { success, message }
 */
function deletePhoto(role, photoId) {
  const storageKey = STORAGE_KEY_PREFIX + (role || 'default');
  const photos = getPhotos(role);
  const index = photos.findIndex(p => p.id === photoId);

  if (index === -1) {
    return { success: false, message: '照片不存在' };
  }

  photos.splice(index, 1);
  wx.setStorageSync(storageKey, photos);

  return { success: true, message: '已删除照片' };
}

/**
 * 清空所有已上传的照片
 * @param {string} role - 角色标识 ('parent' | 'teacher')
 * @returns {Object} 结果 { success, message }
 */
function clearPhotos(role) {
  const storageKey = STORAGE_KEY_PREFIX + (role || 'default');
  wx.setStorageSync(storageKey, []);
  return { success: true, message: '已清空所有照片' };
}

/**
 * 预览照片（全屏查看）
 * @param {string} currentUrl - 当前点击的图片路径
 * @param {Array} urls - 所有图片路径列表
 */
function previewPhoto(currentUrl, urls) {
  wx.previewImage({
    current: currentUrl,
    urls: urls || [currentUrl]
  });
}

/**
 * 生成唯一照片 ID
 * @returns {string}
 */
function generatePhotoId() {
  return 'photo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

module.exports = {
  choosePhoto,
  getPhotos,
  deletePhoto,
  clearPhotos,
  previewPhoto,
  generatePhotoId,
  ensureCameraAuth,
  STORAGE_KEY_PREFIX,
  DEFAULT_CONFIG
};
