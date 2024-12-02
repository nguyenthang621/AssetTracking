import * as yup from 'yup'

export const schemaRegister = yup
  .object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự'),

    fullName: yup
      .string()
      .required('Tên là bắt buộc')
      .min(3, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự'),

    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự'),

    password_confirm: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(5, 'Độ dài từ 6-130 ký tự')
      .max(160, 'Độ dài từ 6-130 ký tự')
      .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không khớp')
  })
  .required()

export const schemaLogin = schemaRegister.omit(['password_confirm', 'fullName'])

export const schemaCamera = yup.object({
  name: yup.string().required('Tên là bắt buộc').min(3, 'Độ dài từ 3-100 ký tự').max(160, 'Độ dài từ 3-100 ký tự'),
  ip_address: yup
    .string()
    .required('Địa chỉ IP là bắt buộc')
    .min(5, 'Độ dài từ 6-130 ký tự')
    .max(160, 'Độ dài từ 6-130 ký tự'),
  location: yup.string().min(5, 'Độ dài từ 6-130 ký tự').max(160, 'Độ dài từ 6-130 ký tự'),
  user_id: yup.string(),
  camera_id: yup.string()
})

export const schemaEmail = yup.object({
  receiver_email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(3, 'Độ dài từ 3-100 ký tự')
    .max(160, 'Độ dài từ 3-100 ký tự'),
  camera_id: yup.string()
})

export const schemaUser = yup.object({
  fullName: yup.string().required('Name là bắt buộc').min(2, 'Độ dài từ 3-100 ký tự').max(160, 'Độ dài từ 3-100 ký tự'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(3, 'Độ dài từ 3-100 ký tự')
    .max(160, 'Độ dài từ 3-100 ký tự'),
  address: yup.string().min(3, 'Độ dài từ 3-100 ký tự').max(160, 'Độ dài từ 3-100 ký tự'),
  phoneNumber: yup.string()
  // avatar: yup.string()
})

export const schemaShade = yup.object({
  name_zone: yup
    .string()
    .required('Name zone là bắt buộc')
    .min(2, 'Độ dài từ 2-100 ký tự')
    .max(100, 'Độ dài từ 3-100 ký tự'),
  coordinates: yup
    .array()
    .of(
      yup.object({
        lat: yup.number().required('Latitude là bắt buộc'),
        lng: yup.number().required('Longitude là bắt buộc')
      })
    )
    .required('Coordinates là bắt buộc'),
  description: yup.string(),
  status: yup.string(),
  type: yup.string(),
  fill_color: yup.string(),
  fill_opacity: yup.string(),
  stroke_color: yup.string(),
  stroke_opacity: yup.string(),
  stroke_weight: yup.string(),
  create_by: yup.string(),
  rule: yup.string()
})

export const schemaAsset = yup.object({
  nameAsset: yup.string().required('Not empty').min(2, 'Độ dài từ 2-100 ký tự').max(100, 'Độ dài từ 3-100 ký tự'),
  description: yup.string(),
  location: yup.array(),
  images: yup.array(),
  resolvedOn: yup.string(),
  resolvedBy: yup.string(),
  locationPosition: yup.string(),
  status: yup.string(),
  zones: yup.array(),
  destination: yup.string(),
  expiredArrivalDate: yup.number(),
  trackers: yup.array()
})

export const schemaTracker = yup.object({
  trackerId: yup.string().required('Not empty').min(2, 'Độ dài từ 2-100 ký tự').max(100, 'Độ dài từ 3-100 ký tự'),
  nameTracker: yup.string().required('Not empty').min(2, 'Độ dài từ 2-100 ký tự').max(100, 'Độ dài từ 3-100 ký tự'),
  description: yup.string(),
  status: yup.string(),
  type: yup.string(),
  dataset: yup.string(),
  zones: yup.array(),
  assets: yup.array()
})
