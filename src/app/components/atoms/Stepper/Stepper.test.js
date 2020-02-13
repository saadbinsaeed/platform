import React from 'react';
import Stepper from 'app/components/atoms/Stepper/Stepper';
import {shallow} from 'enzyme';
import theme from 'app/themes/theme.default';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import {ThemeProvider} from 'styled-components';
import 'jest-styled-components';
import context from 'jest-plugin-context';

// import Button from 'app/components/atoms/Button/Button';
// import renderer from 'react-test-renderer'


const props = {
    title: 'ABC',
    subTitle: 'XYZ',
    children: <div/>,
    step: 2,
    steps: 3,
    onClose: () => {
    },
    onStepChange: () => {
    }
};

describe('<Stepper />', () => {
    const shallowWithTheme = (tree, theme) => {
        const context = shallow(<ThemeProvider theme={theme}/>)
            .instance()
            .getChildContext();
        return shallow(tree, {context});
    };

    describe('title', () => {
        it('should render title in Header Title Element', () => {
            const wrapper = shallow(<Stepper {...props} title="test title"/>);
            expect(wrapper.find('HeaderTitle').children().text()).toEqual('test title');
        });
        it('should render title with h1 as a "as" prop ', () => {
            const wrapper = shallow(<Stepper {...props} title="test title"/>);
            expect(wrapper.find('HeaderTitle').props().as).toEqual('h1');
        });
    });
    describe('subtitle', () => {
        it('should render subtitle in SubHeader Title Element', () => {
            const wrapper = shallow(<Stepper {...props} subTitle="test subtitle"/>);
            expect(wrapper.find('HeaderSubTitle').children().text()).toEqual('test subtitle');
        });
        it('should render subtitle with h2 as a "as" prop', () => {
            const wrapper = shallow(<Stepper {...props} subTitle="test subtitle"/>);
            expect(wrapper.find('HeaderSubTitle').props().as).toEqual('h2');
        });
    });

    describe('step', () => {
        context('when step is more than 1', () => {
            it('should render the two button icon', () => {
                const wrapper = shallow(<Stepper {...props} step={2}/>);
                expect(wrapper.find(ButtonIcon).length).toEqual(2);
            });
        });
        context('when step is 1 or less', () => {
            it('should render the one button icon', () => {
                const wrapper = shallow(<Stepper {...props} step={1}/>);
                expect(wrapper.find(ButtonIcon).length).toEqual(1);
            });
        });
    });

    // describe('step and steps', () => {
    //     context('when step is less than steps', () => {
    //         it('should show the next button', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={3}/>);
    //             expect(wrapper.find('ButtonStyle').children().at(0).text()).toEqual('Next');
    //         });
    //
    //         it('should show the next icon component inside the button', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={3}/>);
    //             expect(wrapper.find('ButtonStyle').children().at(1).props().name).toEqual('chevron-right');
    //         });
    //     });
    //     context('when step is equal or greater than steps', () => {
    //         it('should show the Done button', () => {
    //             const wrapper = shallow(<Stepper {...props} step={4} steps={3}/>);
    //             expect(wrapper.find('ButtonStyle').children().text()).toEqual('Done');
    //         });
    //     });
    // });

    // describe('onStepChange', () => {
    //     // mock funtions
    //     describe('when clicking on next', () => {
    //         const clickFn = jest.fn();
    //         it('should call function once', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={3} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonStyle').simulate('click');
    //             expect(clickFn).toHaveBeenCalledTimes(1);
    //         });
    //         const event = {};
    //         it('should call the function and pass the argument next with event', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={3} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonStyle').simulate('click', event);
    //             expect(clickFn).toHaveBeenCalledWith('next', event);
    //         });
    //     });

    //     describe('when clicking on prev button', () => {
    //         const clickFn = jest.fn();
    //         it('should call function once', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonIcon').at(1).simulate('click');
    //             expect(clickFn).toHaveBeenCalledTimes(1);
    //         });
    //         const event = {};
    //         it('should call the function and pass the argument back with event', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonIcon').at(1).simulate('click', event);
    //             expect(clickFn).toHaveBeenCalledWith('back', event);
    //         });
    //     });
    //
    //     describe('when clicking on done button', () => {
    //         const clickFn = jest.fn();
    //         it('should call function once', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={2} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonStyle').simulate('click');
    //             expect(clickFn).toHaveBeenCalledTimes(1);
    //         });
    //         const event = {};
    //         it('should call the function and pass the argument next with event', () => {
    //             const wrapper = shallow(<Stepper {...props} step={2} steps={2} onStepChange={clickFn}/>);
    //             wrapper.find('ButtonStyle').simulate('click', event);
    //             expect(clickFn).toHaveBeenCalledWith('next', event);
    //         });
    //     });
    //
    // });

    describe('onClose', () => {
        const clickFn = jest.fn();
        it('should call function once   ', () => {
            const wrapper = shallow(<Stepper {...props} step={1} onClose={clickFn}/>);
            wrapper.find('ButtonIcon').simulate('click');
            expect(clickFn).toHaveBeenCalledTimes(1);
        });
    });

    it('show step status according to passed step and steps', () => {
        const wrapper = shallow(<Stepper {...props} step={2} steps={3}/>);
        expect(wrapper.find('span.step-status').text()).toEqual('STEP 2 / 3');
    });

    it('renders a Stpper snapshot', () => {
        const wrapper = shallowWithTheme(<Stepper {...props} />, theme);
        expect(wrapper).toMatchSnapshot();
    });
});
