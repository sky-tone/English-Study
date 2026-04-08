/**
 * photo-uploader.test.js - 拍照上传工具测试
 *
 * 测试覆盖：
 * - 照片选择（含 wx.chooseMedia mock）
 * - 本地存储管理（getPhotos, deletePhoto, clearPhotos）
 * - 照片预览（wx.previewImage mock）
 * - ID 生成唯一性
 * - 边界情况（达到上限、空列表等）
 */

// Mock wx global object for WeChat Mini Program APIs
const mockStorage = {};

global.wx = {
  chooseMedia: jest.fn(),
  previewImage: jest.fn(),
  getSetting: jest.fn((opts) => {
    // Default: camera already authorized
    opts.success({ authSetting: { 'scope.camera': true } });
  }),
  openSetting: jest.fn(),
  showModal: jest.fn(),
  getStorageSync: jest.fn((key) => {
    return mockStorage[key] !== undefined ? mockStorage[key] : '';
  }),
  setStorageSync: jest.fn((key, value) => {
    mockStorage[key] = value;
  }),
  showToast: jest.fn()
};

const {
  choosePhoto,
  getPhotos,
  deletePhoto,
  clearPhotos,
  previewPhoto,
  generatePhotoId,
  ensureCameraAuth,
  STORAGE_KEY_PREFIX,
  DEFAULT_CONFIG
} = require('../photo-uploader');

// Clear storage between tests
beforeEach(() => {
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  jest.clearAllMocks();
});

// ============================================================
// 1. Constants & Config
// ============================================================
describe('Constants & Config', () => {
  test('STORAGE_KEY_PREFIX is defined', () => {
    expect(STORAGE_KEY_PREFIX).toBe('uploaded_photos_');
  });

  test('DEFAULT_CONFIG has expected defaults', () => {
    expect(DEFAULT_CONFIG.maxPhotos).toBe(9);
    expect(DEFAULT_CONFIG.maxSizeKB).toBe(10240);
  });
});

// ============================================================
// 2. generatePhotoId
// ============================================================
describe('generatePhotoId', () => {
  test('returns a string starting with "photo_"', () => {
    const id = generatePhotoId();
    expect(typeof id).toBe('string');
    expect(id.startsWith('photo_')).toBe(true);
  });

  test('generates unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generatePhotoId());
    }
    expect(ids.size).toBe(100);
  });
});

// ============================================================
// 3. getPhotos
// ============================================================
describe('getPhotos', () => {
  test('returns empty array when no photos stored', () => {
    const photos = getPhotos('parent');
    expect(photos).toEqual([]);
  });

  test('returns stored photos for the role', () => {
    const mockPhotos = [
      { id: 'photo_1', path: '/tmp/1.jpg', timestamp: 123 }
    ];
    mockStorage['uploaded_photos_parent'] = mockPhotos;

    const photos = getPhotos('parent');
    expect(photos).toEqual(mockPhotos);
  });

  test('returns empty array if storage value is not an array', () => {
    mockStorage['uploaded_photos_parent'] = 'invalid';
    const photos = getPhotos('parent');
    expect(photos).toEqual([]);
  });

  test('different roles have separate storage', () => {
    mockStorage['uploaded_photos_parent'] = [{ id: 'p1' }];
    mockStorage['uploaded_photos_teacher'] = [{ id: 't1' }, { id: 't2' }];

    expect(getPhotos('parent')).toHaveLength(1);
    expect(getPhotos('teacher')).toHaveLength(2);
  });
});

// ============================================================
// 4. deletePhoto
// ============================================================
describe('deletePhoto', () => {
  test('deletes a photo by ID', () => {
    mockStorage['uploaded_photos_parent'] = [
      { id: 'photo_1', path: '/tmp/1.jpg' },
      { id: 'photo_2', path: '/tmp/2.jpg' }
    ];

    const result = deletePhoto('parent', 'photo_1');
    expect(result.success).toBe(true);

    const remaining = getPhotos('parent');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('photo_2');
  });

  test('returns failure for non-existent photo ID', () => {
    mockStorage['uploaded_photos_parent'] = [
      { id: 'photo_1', path: '/tmp/1.jpg' }
    ];

    const result = deletePhoto('parent', 'photo_nonexistent');
    expect(result.success).toBe(false);
    expect(result.message).toContain('不存在');
  });

  test('returns failure when no photos stored', () => {
    const result = deletePhoto('parent', 'photo_1');
    expect(result.success).toBe(false);
  });
});

// ============================================================
// 5. clearPhotos
// ============================================================
describe('clearPhotos', () => {
  test('clears all photos for a role', () => {
    mockStorage['uploaded_photos_parent'] = [
      { id: 'photo_1' },
      { id: 'photo_2' }
    ];

    const result = clearPhotos('parent');
    expect(result.success).toBe(true);

    const photos = getPhotos('parent');
    expect(photos).toEqual([]);
  });

  test('clearing one role does not affect another', () => {
    mockStorage['uploaded_photos_parent'] = [{ id: 'p1' }];
    mockStorage['uploaded_photos_teacher'] = [{ id: 't1' }];

    clearPhotos('parent');
    expect(getPhotos('parent')).toEqual([]);
    expect(getPhotos('teacher')).toHaveLength(1);
  });
});

// ============================================================
// 6. previewPhoto
// ============================================================
describe('previewPhoto', () => {
  test('calls wx.previewImage with correct params', () => {
    const urls = ['/tmp/1.jpg', '/tmp/2.jpg'];
    previewPhoto('/tmp/1.jpg', urls);

    expect(wx.previewImage).toHaveBeenCalledWith({
      current: '/tmp/1.jpg',
      urls: urls
    });
  });

  test('uses single URL array when urls not provided', () => {
    previewPhoto('/tmp/1.jpg');

    expect(wx.previewImage).toHaveBeenCalledWith({
      current: '/tmp/1.jpg',
      urls: ['/tmp/1.jpg']
    });
  });
});

// ============================================================
// 7. choosePhoto
// ============================================================
describe('choosePhoto', () => {
  test('resolves with photos on success', async () => {
    wx.chooseMedia.mockImplementation((opts) => {
      opts.success({
        tempFiles: [
          { tempFilePath: '/tmp/new1.jpg', size: 1024 },
          { tempFilePath: '/tmp/new2.jpg', size: 2048 }
        ]
      });
    });

    const result = await choosePhoto({ role: 'parent' });
    expect(result.success).toBe(true);
    expect(result.photos).toHaveLength(2);
    expect(result.photos[0].path).toBe('/tmp/new1.jpg');
    expect(result.photos[0].role).toBe('parent');
    expect(result.photos[0].id).toBeTruthy();
  });

  test('saves photos to storage', async () => {
    wx.chooseMedia.mockImplementation((opts) => {
      opts.success({
        tempFiles: [
          { tempFilePath: '/tmp/new1.jpg', size: 1024 }
        ]
      });
    });

    await choosePhoto({ role: 'parent' });
    const stored = getPhotos('parent');
    expect(stored).toHaveLength(1);
    expect(stored[0].path).toBe('/tmp/new1.jpg');
  });

  test('appends to existing photos', async () => {
    mockStorage['uploaded_photos_parent'] = [
      { id: 'existing_1', path: '/tmp/old.jpg', size: 500, timestamp: 100, role: 'parent' }
    ];

    wx.chooseMedia.mockImplementation((opts) => {
      opts.success({
        tempFiles: [
          { tempFilePath: '/tmp/new1.jpg', size: 1024 }
        ]
      });
    });

    await choosePhoto({ role: 'parent' });
    const stored = getPhotos('parent');
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('existing_1');
  });

  test('rejects when max photos reached', async () => {
    const fullList = Array.from({ length: 9 }, (_, i) => ({
      id: `photo_${i}`, path: `/tmp/${i}.jpg`, size: 100, timestamp: i, role: 'parent'
    }));
    mockStorage['uploaded_photos_parent'] = fullList;

    const result = await choosePhoto({ role: 'parent', maxPhotos: 9 });
    expect(result.success).toBe(false);
    expect(result.message).toContain('9');
    expect(wx.chooseMedia).not.toHaveBeenCalled();
  });

  test('limits count to remaining slots', async () => {
    const existing = Array.from({ length: 7 }, (_, i) => ({
      id: `photo_${i}`, path: `/tmp/${i}.jpg`, size: 100, timestamp: i, role: 'parent'
    }));
    mockStorage['uploaded_photos_parent'] = existing;

    wx.chooseMedia.mockImplementation((opts) => {
      expect(opts.count).toBe(2); // 9 - 7 = 2
      opts.success({ tempFiles: [{ tempFilePath: '/tmp/8.jpg', size: 100 }] });
    });

    const result = await choosePhoto({ role: 'parent', maxPhotos: 9 });
    expect(result.success).toBe(true);
  });

  test('handles user cancel gracefully', async () => {
    wx.chooseMedia.mockImplementation((opts) => {
      opts.fail({ errMsg: 'chooseMedia:fail cancel' });
    });

    const result = await choosePhoto({ role: 'parent' });
    expect(result.success).toBe(false);
    expect(result.message).toBe('');
  });

  test('handles non-cancel failure', async () => {
    wx.chooseMedia.mockImplementation((opts) => {
      opts.fail({ errMsg: 'chooseMedia:fail system error' });
    });

    const result = await choosePhoto({ role: 'parent' });
    expect(result.success).toBe(false);
    expect(result.message).toContain('失败');
  });

  test('uses teacher role correctly', async () => {
    wx.chooseMedia.mockImplementation((opts) => {
      opts.success({
        tempFiles: [{ tempFilePath: '/tmp/t1.jpg', size: 1024 }]
      });
    });

    const result = await choosePhoto({ role: 'teacher' });
    expect(result.success).toBe(true);
    expect(result.photos[0].role).toBe('teacher');

    const stored = getPhotos('teacher');
    expect(stored).toHaveLength(1);
  });
});

// ============================================================
// 8. ensureCameraAuth
// ============================================================
describe('ensureCameraAuth', () => {
  test('resolves immediately when camera is already authorized', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': true } });
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
    expect(wx.showModal).not.toHaveBeenCalled();
  });

  test('resolves when camera has never been requested (undefined)', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: {} });
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
    expect(wx.showModal).not.toHaveBeenCalled();
  });

  test('shows modal when camera was previously denied', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.success({ confirm: false }); // user picks "仅相册"
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '需要摄像头权限',
        confirmText: '去设置'
      })
    );
  });

  test('opens settings when user confirms re-enable', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.success({ confirm: true }); // user picks "去设置"
    });
    wx.openSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': true } });
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
    expect(wx.openSetting).toHaveBeenCalled();
  });

  test('resolves even if user does not re-enable in settings', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.success({ confirm: true });
    });
    wx.openSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
  });

  test('resolves when openSetting fails', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.success({ confirm: true });
    });
    wx.openSetting.mockImplementation((opts) => {
      opts.fail();
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
  });

  test('resolves when getSetting fails', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.fail();
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
  });

  test('resolves when showModal fails', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.fail();
    });

    await expect(ensureCameraAuth()).resolves.toBeUndefined();
  });
});

// ============================================================
// 9. choosePhoto with camera auth flow
// ============================================================
describe('choosePhoto camera auth integration', () => {
  test('calls getSetting before chooseMedia', async () => {
    const callOrder = [];
    wx.getSetting.mockImplementation((opts) => {
      callOrder.push('getSetting');
      opts.success({ authSetting: { 'scope.camera': true } });
    });
    wx.chooseMedia.mockImplementation((opts) => {
      callOrder.push('chooseMedia');
      opts.success({ tempFiles: [{ tempFilePath: '/tmp/1.jpg', size: 100 }] });
    });

    await choosePhoto({ role: 'parent' });
    expect(callOrder).toEqual(['getSetting', 'chooseMedia']);
  });

  test('still calls chooseMedia after user picks album-only fallback', async () => {
    wx.getSetting.mockImplementation((opts) => {
      opts.success({ authSetting: { 'scope.camera': false } });
    });
    wx.showModal.mockImplementation((opts) => {
      opts.success({ confirm: false }); // "仅相册"
    });
    wx.chooseMedia.mockImplementation((opts) => {
      opts.success({ tempFiles: [{ tempFilePath: '/tmp/1.jpg', size: 100 }] });
    });

    const result = await choosePhoto({ role: 'parent' });
    expect(result.success).toBe(true);
    expect(wx.chooseMedia).toHaveBeenCalled();
  });

  test('does not call getSetting when max photos already reached', async () => {
    const fullList = Array.from({ length: 9 }, (_, i) => ({
      id: `photo_${i}`, path: `/tmp/${i}.jpg`, size: 100, timestamp: i, role: 'parent'
    }));
    mockStorage['uploaded_photos_parent'] = fullList;

    const result = await choosePhoto({ role: 'parent', maxPhotos: 9 });
    expect(result.success).toBe(false);
    expect(wx.getSetting).not.toHaveBeenCalled();
  });
});
