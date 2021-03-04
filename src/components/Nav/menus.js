export default [
  {
    label: '手筋',
    children: [
      {
        label: '初期位置玉の暗殺',
        to: '/trick/shokiansatsu/',
      },
      {
        label: '底歩',
        to: '/trick/sokohu/',
      },
      {
        label: '初期位置の大駒狩り',
        to: '/trick/oogomagari/',
      },
      {
        label: '二択攻撃',
        to: '/trick/nitaku/',
      },
      {
        label: '存在確認の駒打ち',
        to: '/trick/kakunin/',
      },
      {
        label: '不成り',
        to: '/trick/funari/',
      },
    ],
  },
  {
    label: 'ついたて詰将棋',
    children: [
      {
        label: '投稿作品一覧',
        to: '/create/',
      },
    ],
  },
  {
    label: 'ついたて詰将棋作成',
    children: [
      {
        label: '新規作成',
        to: '/create/new/',
      },
      {
        label: '一覧',
        to: '/create/',
      },
    ],
  },
  { label: 'ログイン', loggedIn: false, to: '/login/' },
];
