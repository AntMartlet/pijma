import React, {RefObject, createRef, Fragment} from 'react'

import {
  SuggestControl,
  Image,
  MenuControl,
  Icon,
  ContentInput,
  Pos,
  Box,
  Card,
  styled,
  Spacer,
} from '@qiwi/pijma-core'

import {Paragraph} from '../typography'
import {Link} from '../link'
import {DropDown} from '../drop-down'
import {MenuItem} from '../menu'

import ContentSuggestProps from './ContentSuggestProps'
import ContentSuggestOptionsModel from './ContentSuggestOptionModel'

const CardPos = Card.withComponent(Pos)
const CardItem = styled(Card)().withComponent(MenuItem)

const dropDownContainerRef: RefObject<HTMLDivElement> = createRef()

export const ContentSuggest = <V extends {}>({
    equals = (a: V, b: V) => a === b,
    ...props
  }: ContentSuggestProps<ContentSuggestOptionsModel<V>, V>) => (
  <SuggestControl<V>
    value={props.value}
    suggest={props.suggest}
    items={props.items}
    total={props.total}
    empty={props.empty}
    equals={equals}
    onRequest={props.onRequest}
    onChange={props.onChange}
    onBlur={props.onBlur}
    onFocus={props.onFocus}
    onSubmit={props.onSubmit}
    onCancel={props.onCancel}
    onHide={props.onHide}
    children={(renderProps) => (
      <MenuControl
        count={props.items.length}
        selected={renderProps.selected}
        onSelect={renderProps.onItemSelect}
        onKeyDown={renderProps.onItemKeyDown}
        children={(menuRenderProps) => (
          <CardPos
            type="relative"
            ref={dropDownContainerRef}
            width={1}
            transition={`box-shadow ${renderProps.result ? 300 : 200}ms cubic-bezier(0.4, 0.0, 0.2, 1)`}
            s={renderProps.focused || renderProps.result ? '0 20px 64 px 0 rgba(0, 0, 0, 0.16)' : 'none'}
            r={10}
          >
            <Box
              width={1}
              onMouseEnter={renderProps.onInputMouseEnter}
              onMouseLeave={renderProps.onInputMouseLeave}
            >
              <ContentInput
                value={props.suggest || ''}
                tabIndex={props.tabIndex}
                autoComplete={props.autoComplete}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                ref={renderProps.inputRef}
                pr={14}
                error={!!props.error}
                focused={renderProps.focused}
                norb={renderProps.result}
                hovered={renderProps.hovered}
                onChange={renderProps.onRequest}
                onFocus={renderProps.onInputFocus}
                onBlur={renderProps.onInputBlur}
                onKeyDown={renderProps.result ? menuRenderProps.onKeyDown : renderProps.onItemKeyDown}
              />
              <Pos
                type="absolute"
                cursor="pointer"
                right={4}
                top={3}
                onMouseDown={renderProps.onSearchMouseDown}
                onClick={renderProps.onSearchClick}
                children={<Icon name="search" color="#666"/>}
              />
            </Box>
            <DropDown
              minWidth={1}
              show={renderProps.result}
              rootClose={false}
              container={dropDownContainerRef.current}
              target={renderProps.inputRef.current!}
              onHide={renderProps.onHide}
            >
              <Card
                height={1}
                minWidth={1}
                r={10}
                s="0 20px 20px 0 rgba(0, 0, 0, 0.16)"
              >
                <CardPos
                  type="relative"
                  width={1}
                  height={1}
                  maxHeight={98}
                  bg="#fff"
                  r="0 0 10px 10px"
                  bt="solid 1px #e6e6e6"
                  ref={menuRenderProps.containerRef}
                  overflow="auto"
                  py={3}
                  onMouseDown={renderProps.onResultItemsMouseDown}
                >
                  {props.loading ? (
                    Array(4).fill(1).map((_item, key) => (
                      <CardItem key={key} icon={true} stub text="stub" notes="stub"/>
                    ))
                  ) : (
                    <Spacer size="s">
                      {menuRenderProps.items.length > 0 ? (
                        <Fragment>
                          {menuRenderProps.items.map((item, key) => (
                            <CardItem
                              key={key}
                              ref={item.ref}
                              onClick={item.onClick}
                              onMouseDown={item.onMouseDown}
                              onMouseEnter={item.onMouseEnter}
                              cursor="pointer"
                              text={props.items[key].title}
                              notes={props.items[key].description}
                              icon={<Image width={6} height={6} src={props.items[key].logo}/>}
                              hover={item.focused}
                              active={item.selected}
                              focus={item.selected}
                            />
                          ))}
                        </Fragment>
                      ) : (
                        null
                      )}
                      {props.total && menuRenderProps.items.length > 0 ? (
                        <Box px={4}>
                          <Paragraph>
                            {props.total.text}
                            {props.total.link ? (
                              <Fragment>
                                {' '}
                                <Link
                                  onClick={renderProps.onTotalClick}
                                  children={props.total.link.text}
                                />
                              </Fragment>
                            ) : (
                              null
                            )}
                          </Paragraph>
                        </Box>
                      ) : props.empty && menuRenderProps.items.length === 0 ? (
                        <Box px={4}>
                          <Paragraph>
                            {props.empty.text}
                            {props.empty.link ? (
                              <Fragment>
                                {' '}
                                <Link
                                  onClick={renderProps.onEmptyClick}
                                  children={props.empty.link.text}
                                />
                              </Fragment>
                            ) : (
                              null
                            )}
                          </Paragraph>
                        </Box>
                      ) : (
                        null
                      )}
                    </Spacer>
                  )}
                </CardPos>
              </Card>
            </DropDown>
          </CardPos>
        )}
      />
    )}
  />
)

ContentSuggest.defaultProps = {
  equals: (a: any, b: any) => a === b,
}
