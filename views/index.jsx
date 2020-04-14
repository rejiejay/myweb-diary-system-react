import fetch from './../components/async-fetch/fetch.js'
import login from './../components/login.js';
import { dropDownSelectPopup } from './../components/drop-down-select-popup.js';

import TagComponent from './tag.jsx';
import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pageNo: 1,
            dataTotal: 0,
            sort: CONST.SORT.DEFAULTS.value,
            dataType: CONST.DATA_TYPE.DEFAULTS.value,
            tag: 'all',
            list: CONST.DATA.DEFAULTS
        }

        this.minTimestamp = 0
        this.maxTimestamp = 0
    }

    async componentDidMount() {
        await login()
        await this.initList({ isRefresh: true })
    }

    async initList({ isRefresh }) {
        const self = this
        const { list, dataType, pageNo, sort } = this.state

        await fetch.get({
            url: 'android/recordevent/list',
            query: {
                sort,
                type: dataType,
                pageNo
            }
        }).then(
            ({ data }) => self.setState({
                list: isRefresh ? data.list : list.concat(data.list),
                dataTotal: data.total
            }),
            error => { }
        )
    }

    switchDataTypeHandle() {
        const self = this
        const handle = async ({ value, label }) => {
            self.setState({
                pageNo: 1,
                dataType: value
            })
            self.initList({ isRefresh: true })
        }
        dropDownSelectPopup({
            list: Object.values(CONST.DATA_TYPE),
            handle
        })
    }

    switchSortTypeHandle() {
        const self = this
        const handle = async ({ value, label }) => {
            self.setState({
                pageNo: 1,
                sort: value
            })
            self.initList({ isRefresh: true })
        }
        dropDownSelectPopup({
            list: Object.values(CONST.SORT),
            handle
        })
    }

    selectTagHandle() {
        this.refs.tag.show()
    }

    showMoreHandle() {
        const self = this
        const { pageNo } = this.state

        this.setState({
            pageNo: pageNo + 1
        }, () => self.initList({}))
    }

    renderRecord({ recordtitle, recordmaterial, recordcontent, tag }, key) {
        return (
            <div className="list-item" key={key}>
                <div className="list-item-container">
                    <div className="list-item-title">{recordtitle}</div>
                    {recordmaterial && <div className="list-item-material">{recordmaterial}</div>}
                    <div className="list-item-content"
                        dangerouslySetInnerHTML={{ __html: recordcontent.replace(/\n/g, "<br>") }}
                    ></div>
                    <div className="list-item-operating flex-start-center">
                        <div className="operating-tag flex-rest">{tag || '全部'}</div>
                        <div className="operating-del flex-center">
                            <svg width="16" height="16" t="1586829128722" class="icon" viewBox="0 0 1024 1024">
                                <path fill="#606266" d="M412 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36zM612 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36z"></path>
                                <path fill="#606266" d="M923.8 248H736v-82c0-56.2-45.8-102-102-102H390c-56.2 0-102 45.8-102 102v82H100.2C80.3 248 64 264.2 64 284s16.3 36 36.2 36H192v518c0 16.4 3.2 32.4 9.6 47.5 6.1 14.5 14.9 27.6 26.1 38.8 11.2 11.2 24.2 20 38.8 26.1 15.1 6.4 31.1 9.6 47.5 9.6h396c16.4 0 32.4-3.2 47.5-9.6 14.5-6.1 27.6-14.9 38.8-26.1 11.2-11.2 20-24.2 26.1-38.8 6.4-15.1 9.6-31.1 9.6-47.5V320h91.8c19.9 0 36.2-16.2 36.2-36s-16.3-36-36.2-36zM360 166c0-16.6 13.4-30 30-30h244c16.6 0 30 13.4 30 30v82H360v-82z m400 672c0 27.6-22.4 50-50 50H314c-27.6 0-50-22.4-50-50V320h496v518z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderEvent({ eventtitle, eventsituation, eventtarget, eventaction, eventresult, eventconclusion, week, timestamp }, key) {
        const getYYmmDDww = () => {
            const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            const date = new Date(+timestamp)
            const weekDay = date.getDay()
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 第${week}周 ${weeks[weekDay]}`
        }

        return (
            <div className="list-item" key={key}>
                <div className="list-item-container">
                    <div className="list-item-title">{eventtitle}</div>
                    <div className="item-events-content">
                        <div className="item-content-description"
                            dangerouslySetInnerHTML={{ __html: `情况: ${eventsituation.replace(/\n/g, "<br>")}` }}
                        ></div>
                        <div className="item-content-description"
                            dangerouslySetInnerHTML={{ __html: `目标: ${eventtarget.replace(/\n/g, "<br>")}` }}
                        ></div>
                        <div className="item-content-description"
                            dangerouslySetInnerHTML={{ __html: `行动: ${eventaction.replace(/\n/g, "<br>")}` }}
                        ></div>
                        <div className="item-content-description"
                            dangerouslySetInnerHTML={{ __html: `结果: ${eventresult.replace(/\n/g, "<br>")}` }}
                        ></div>
                        <div className="item-content-description"
                            dangerouslySetInnerHTML={{ __html: `结论: ${eventconclusion.replace(/\n/g, "<br>")}` }}
                        ></div>
                    </div>
                    {/* image */}
                    <div className="list-item-operating flex-start-center">
                        <div className="operating-timestamp flex-rest">{getYYmmDDww()}</div>
                        <div className="operating-del flex-center">
                            <svg width="16" height="16" t="1586829128722" class="icon" viewBox="0 0 1024 1024">
                                <path fill="#606266" d="M412 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36zM612 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36z"></path>
                                <path fill="#606266" d="M923.8 248H736v-82c0-56.2-45.8-102-102-102H390c-56.2 0-102 45.8-102 102v82H100.2C80.3 248 64 264.2 64 284s16.3 36 36.2 36H192v518c0 16.4 3.2 32.4 9.6 47.5 6.1 14.5 14.9 27.6 26.1 38.8 11.2 11.2 24.2 20 38.8 26.1 15.1 6.4 31.1 9.6 47.5 9.6h396c16.4 0 32.4-3.2 47.5-9.6 14.5-6.1 27.6-14.9 38.8-26.1 11.2-11.2 20-24.2 26.1-38.8 6.4-15.1 9.6-31.1 9.6-47.5V320h91.8c19.9 0 36.2-16.2 36.2-36s-16.3-36-36.2-36zM360 166c0-16.6 13.4-30 30-30h244c16.6 0 30 13.4 30 30v82H360v-82z m400 672c0 27.6-22.4 50-50 50H314c-27.6 0-50-22.4-50-50V320h496v518z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const self = this
        const { list, dataTotal, dataType, sort } = this.state

        let diff = dataTotal - list.length
        diff = diff > 0 ? diff : 0

        const renderDataType = () => {
            if (dataType === CONST.DATA_TYPE.EVENT.value) return CONST.DATA_TYPE.EVENT.label
            if (dataType === CONST.DATA_TYPE.RECORD.value) return CONST.DATA_TYPE.RECORD.label
            if (dataType === CONST.DATA_TYPE.DEFAULTS.value) return CONST.DATA_TYPE.DEFAULTS.label
        }

        const renderSortType = () => {
            if (sort === CONST.SORT.DEFAULTS.value) return CONST.SORT.DEFAULTS.label
            if (sort === CONST.SORT.TIME.value) return CONST.SORT.TIME.label
            if (sort === CONST.SORT.RANDOM.value) return CONST.SORT.RANDOM.label
        }

        return [
            // 操作区域
            <div className="operating">
                <div className="operating-container">

                    <div className="operating-filter flex-start-center">
                        <div className="filter-btn flex-center flex-rest">日期</div>
                        <div className="dividing-line"></div>
                        <div className="filter-btn flex-center flex-rest"
                            onClick={this.selectTagHandle.bind(this)}
                        >标签</div>
                        <div className="dividing-line"></div>
                        <div className="filter-btn flex-center flex-rest"
                            onClick={this.switchDataTypeHandle.bind(this)}
                        >{renderDataType()}</div>
                        <div className="dividing-line"></div>
                        <div className="filter-btn flex-center flex-rest"
                            onClick={this.switchSortTypeHandle.bind(this)}
                        >{renderSortType()}</div>
                    </div>

                    <div className="operating-add flex-start-center">
                        <div className="add-btn flex-center flex-rest">日记</div>
                        <div className="dividing-line"></div>
                        <div className="add-btn flex-center flex-rest">记录</div>
                    </div>
                </div>
            </div>,

            // 列表页
            <div className="list">{list.map((val, key) => {
                if (val.type === 'record') return self.renderRecord(val, key)
                if (val.type === 'event') return self.renderEvent(val, key)
            })}</div>,

            // 加载更多
            <div className="load">
                <div className="load-container flex-center"
                    onClick={this.showMoreHandle.bind(this)}
                >加载更多 ({diff})</div>
            </div>,

            <TagComponent ref='tag'></TagComponent>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
