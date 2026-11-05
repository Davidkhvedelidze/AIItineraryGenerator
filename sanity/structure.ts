import type {StructureResolver} from 'sanity/structure'

const pinnedTypes = ['blogPost', 'tour', 'destination']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('blogPost').title('Blog Posts'),
      S.documentTypeListItem('tour').title('Tours'),
      S.listItem()
        .title('Destinations')
        .schemaType('destination')
        .child(
          S.documentTypeList('destination')
            .title('Destinations')
            .defaultOrdering([
              {field: 'order', direction: 'asc'},
              {field: 'title', direction: 'asc'},
            ]),
        ),
      ...S.documentTypeListItems().filter((item) => !pinnedTypes.includes(item.getId() ?? '')),
    ])
