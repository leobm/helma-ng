importFromModule('helma.hibernate.migrate', '*');


function up() {
   createTable({ entity: Article, props: {
         title: {
            type: 'string'
            notNull: true
         },
         text: {
            type: 'text',
            notNull: true
         },
         createTime: {
            type: 'timestamp',
            notNull: true,
            updates: false
         },
         updateTime: {
            type: 'timestamp'
         }
      }
   });
}


function down() {
   dropTable('articles');
}
