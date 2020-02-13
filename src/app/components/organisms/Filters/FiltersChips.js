// @flow
// $FlowFixMe
import React, { memo, useState, useCallback, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, Grid, Avatar, ClickAwayListener, Tooltip, Chip } from '@mic3/platform-ui';
import { get, set } from 'app/utils/lo/lo';
import { getStr } from 'app/utils/utils';
import { getPriorityColor } from 'app/config/aboxConfig';
import { formatDate } from 'app/utils/date/date';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { createInitials, generateColor } from 'app/utils/avatar/avatar';

const ChipStyled = styled(Chip)`
    margin: 1px;
    height: 24px;
    ${({theme, priority}) => priority && `background: linear-gradient(45deg, ${theme.priorityGradients[priority][0]}, ${theme.priorityGradients[priority][1]}) !important;`}
`;

const UserAvatar = styled(Avatar)`
background-color: ${({ theme, name }) => generateColor(Object.values(theme.statusColors), name)} !important;
`;

const ChipTooltip = memo(({ tooltip, ...restProps }) => {
    const [isOpen, setTooltip] = useState(false);
    const close = useCallback(() => {
        setTooltip(false);
    }, [setTooltip]);
    const open = useCallback(() => {
        setTooltip(true);
    }, [setTooltip]);
    return (
        <ClickAwayListener onClickAway={close}>
            <div>
                <Tooltip
                    PopperProps={{ disablePortal: true }}
                    onClose={close}
                    open={isOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={tooltip}
                >
                    <ChipStyled {...restProps} onClick={open}/>
                </Tooltip>
            </div>
        </ClickAwayListener>
    );
});

class FiltersChips extends PureComponent<Object, Object> {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        filters: PropTypes.object.isRequired,
        filterDefinitions: PropTypes.array.isRequired,
    }

    @bind
    buildOnDelete(property){
        return () => {
            this.props.onChange(set(this.props.filters, property, null));
        };
    }

    @bind
    parseTooltip(definition, filters, name, value) {
        let tooltip = value;

        // take Label from options if exist
        (get(definition, 'properties.options') || []).forEach((opt) => {
            if(get(opt, 'value') === value) {
                tooltip = opt.label;
            }
        });

        // define label by type
        switch(definition.type) {
            case 'userTypeahead': {
                const userName = getStr(filters, `${String(name)}.name`);
                tooltip = `${userName || ''} (${getStr(filters, `${String(name)}.login`) || ''})`;
                break;
            }
            case 'dateTimeRange': {
                tooltip = `${formatDate(filters[name][0])} - ${formatDate(filters[name][1])}`;
                break;
            }
            default:
        }

        return tooltip;
    }

    @bind
    parseAvatar(definition, filters, name) {
        const { classes } = this.props;
        let avatar =  null;
        switch(definition.type) {
            case 'userTypeahead': {
                const image = get(filters, `${String(name)}.image`);
                const userName = getStr(filters, `${String(name)}.name`);
                if (image) {
                    avatar = <Avatar src={image} className={classes.avatar} />;
                } else if(userName) {
                    avatar = <UserAvatar name={userName} className={classes.avatar} >{createInitials(userName)}</UserAvatar>;
                }
                break;
            }
            default:
        }
        return avatar;
    }

    @bind
    @memoize()
    buildChips(filters, filterDefinitions) {
        const { classes } = this.props;
        return Object.keys(filters)
            .filter(name => filters[name] && name !== 'searchBar')
            .map((name) => {
                const definition = filterDefinitions.filter(def => name === get(def, 'properties.name'));
                const tooltip = this.parseTooltip(definition[0], filters, name, filters[name]);
                const avatar =  this.parseAvatar(definition[0], filters, name);

                const extraProps = {};
                if(definition[0].field === 'priority') {
                    extraProps.priority = getPriorityColor(filters[name]);
                }
                return (
                    <ChipTooltip
                        key={String(name)}
                        avatar={avatar}
                        label={get(definition, '[0].properties.label')}
                        onDelete={this.buildOnDelete(name)}
                        className={classes.chip}
                        tooltip={tooltip}
                        color="primary"
                        {...extraProps}
                    />
                );
            });
    }

    render() {
        const { classes, filters, filterDefinitions } = this.props;
        return (
            <Grid className={classes.appBar} container spacing={16} alignItems="center">
                {this.buildChips(filters, filterDefinitions)}
            </Grid>

        );
    }
};

const styles = theme => ({
    appBar: {
        margin: '8px 0px',
        width: '100%',
    },
    chip: {
        height: '24px',
        margin: '0 4px',
    },
    avatar: {
        width: '24px',
        height: '24px',
    }
});
export default withStyles(styles)(FiltersChips);
