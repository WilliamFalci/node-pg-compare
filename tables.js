const tables = [
  {master:'users_user', slave: 'users_user'},
  {master:'users_customerprofile', slave: 'users_customerprofile'},
  {master:'shop_shop', slave: 'shop_shop'}
]

module.exports = {tables}