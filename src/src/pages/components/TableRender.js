export default {
    name: 'TableRender',
    functional: true,
    props: {
        render: Function,
        column: {
            type: Object,
            default: null
        },
        index: Number,
        row: Object,
        Number: Number
    },
    render: (h, ctx) => {
        const params = {
            row: ctx.props.row,
            index: ctx.props.index
        }
        return ctx.props.render(h, params)
    }
}