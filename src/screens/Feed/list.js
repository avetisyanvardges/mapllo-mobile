import {isEmpty} from 'lodash'
import React, {createRef} from 'react'
import {FlatList, Keyboard, RefreshControl} from 'react-native'

const limit = 10

const config = {waitForInteraction: false, viewAreaCoveragePercentThreshold: 2}

export default class AbstractList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemHeight: 0,
      refreshing: false,
      offset: 0,
      hasMore: true,
      isKeyboardVisible: false,
    }
    this.listRef = createRef()
    this.view = ({changed, viewableItems}) => {
      this.props.setActiveData(viewableItems[0]?.item)
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.onKeyboardDidShow,
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.onKeyboardDidHide,
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onKeyboardDidShow = () => {
    this.setState({isKeyboardVisible: true})
  }

  onKeyboardDidHide = () => {
    this.setState({isKeyboardVisible: false})
  }

  toTop = (animated = true) => {
    this.listRef.current.scrollToOffset({animated})
    this.refresh(false)
  }

  hasMoreItems = () => {
    return this.state.hasMore
  }

  refresh = (withLoader = true) => {
    this.setState(s => ({...s, refreshing: withLoader, offset: 0}))
    this.props.download(0, limit).then(data => {
      if (limit >= data.length) {
        this.setState(s => ({
          ...s,
          hasMore: true,
          offset: Math.min(limit, data.length),
        }))
      } else {
        this.setState(s => ({
          ...s,
          hasMore: false,
          offset: Math.min(limit, data.length),
        }))
      }
      this.props.setData(data)
      this.props.setActiveData(data.length === 0 ? null : data[0])
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState(s => ({...s, refreshing: false}))
    }
  }

  downloadMore = () => {
    if (this.state.hasMore) {
      this.props.download(this.state.offset, limit).then(downloadData => {
        if (limit > downloadData.length) {
          this.setState(s => ({...s, hasMore: false}))
        }
        this.setState(s => ({
          ...s,
          offset: s.offset + Math.min(limit, downloadData.length),
        }))
        if (downloadData.length > 0) {
          this.props.setData([...this.props.data, ...downloadData])
        }
      })
    }
  }

  renderItem = ({item}) => {
    if (item.id !== 'loader') {
      return this.props.renderData(item, this.state.itemHeight)
    }
  }

  renderEmptyItem = () => {
    return this.props.renderEmptyItem()
  }

  hide = () => {
    this.props.setData(dat =>
      dat.filter(d => d.id !== this.props.activeData.id),
    )
    this.setState(s => ({...s, offset: s.offset - 1}))
  }

  onLayout = e => {
    if (!this.state.isKeyboardVisible) {
      e.persist()
      this.setState(s => ({...s, itemHeight: e.nativeEvent.layout.height}))
    }
  }

  render() {
    return (
      <FlatList
        ref={this.listRef}
        data={this.props.data}
        style={{flex: 1}}
        onLayout={e => this.onLayout(e)}
        showsVerticalScrollIndicator={false}
        onEndReached={this.downloadMore}
        viewabilityConfig={config}
        onViewableItemsChanged={this.view}
        pagingEnabled
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
            tintColor="#A347FF"
          />
        }
        onScroll={this.props.onScroll}
        contentContainerStyle={[isEmpty(this.props.data) ? {flex: 1} : null]}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderEmptyItem}
      />
    )
  }
}
