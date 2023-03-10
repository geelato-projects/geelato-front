import ButtonMeta from "../components/setter/button/ButtonMeta";
import ButtonInstance from "../components/setter/button/ButtonInstance";
import RateMeta from "../components/setter/rate/RateMeta";
import SwitchMeta from "../components/setter/switch/SwitchMeta";
import AutoCompleteMeta from "../components/setter/autoComplete/AutoCompleteMeta";
import AutoCompleteInstance from "../components/setter/autoComplete/AutoCompleteInstance";
import DividerMeta from "../components/setter/divider/DividerMeta";
import IconMeta from "../components/setter/icon/IconMeta";
import TypographyMeta from "../components/setter/typography/TypographyMeta";
import GridMeta from "../components/setter/grid/GridMeta";
import LayoutMeta from "../components/setter/layout/LayoutMeta";
import SpaceMeta from "../components/setter/space/SpaceMeta";
import AffixMeta from "../components/setter/affix/AffixMeta";
import AffixInstance from "../components/setter/affix/AffixInstance";
import BreadcrumbMeta from "../components/setter/breadcrumb/BreadcrumbMeta";
import DropdownMeta from "../components/setter/dopdown/DropdownMeta";
import MenuMeta from "../components/setter/menu/MenuMeta";
import PageHeaderMeta from "../components/setter/pageHeader/PageHeaderMeta";
import PaginationMeta from "../components/setter/pagination/PaginationMeta";
import StepsMeta from "../components/setter/steps/StepsMeta";
import CascaderMeta from "../components/setter/cascader/CascaderMeta";
import CheckboxMeta from "../components/setter/checkbox/CheckboxMeta";
import DatePickerMeta from "../components/setter/datePicker/DatePickerMeta";
import FormMeta from "../components/setter/form/FormMeta";
import InputMeta from "../components/setter/input/InputMeta";
import InputNumberMeta from "../components/setter/inputNumber/InputNumberMeta";
import MentionsMeta from "../components/setter/mentions/MentionsMeta";
import RadioMeta from "../components/setter/radio/RadioMeta";
import SelectMeta from "../components/setter/select/SelectMeta";
import SliderMeta from "../components/setter/slider/SliderMeta";
import TimePickerMeta from "../components/setter/timePicker/TimePickerMeta";
import TransferMeta from "../components/setter/transfer/TransferMeta";
import TreeSelectMeta from "../components/setter/treeSelect/TreeSelectMeta";
import UploadMeta from "../components/setter/upload/UploadMeta";
import AvatarMeta from "../components/setter/avatar/AvatarMeta";
import BadgeMeta from "../components/setter/badge/BadgeMeta";
import CalendarMeta from "../components/setter/calendar/CalendarMeta";
import CardMeta from "../components/setter/card/CardMeta";
import CarouselMeta from "../components/setter/carousel/CarouselMeta";
import CollapseMeta from "../components/setter/collapse/CollapseMeta";
import CommentMeta from "../components/setter/comment/CommentMeta";
import DescriptionsMeta from "../components/setter/descriptions/DescriptionsMeta";
import EmptyMeta from "../components/setter/empty/EmptyMeta";
import ImageMeta from "../components/setter/image/ImageMeta";
import ListMeta from "../components/setter/list/ListMeta";
import PopoverMeta from "../components/setter/popover/PopoverMeta";
import StatisticMeta from "../components/setter/statistic/StatisticMeta";
import TableMeta from "../components/setter/table/TableMeta";
import TabsMeta from "../components/setter/tabs/TabsMeta";
import TagMeta from "../components/setter/tag/TagMeta";
import TimeLineMeta from "../components/setter/timeLine/TimeLineMeta";
import TooltipMeta from "../components/setter/tooltip/TooltipMeta";
import TreeMeta from "../components/setter/tree/TreeMeta";
import {ComponentMeta, ComponentInstance, ComponentMaterial} from "@geelato/gl-ui-schema";


// @ts-ignore
const componentMetas:Array<ComponentMeta> = [ButtonMeta, IconMeta,InputMeta, InputNumberMeta, RateMeta,TableMeta, TypographyMeta, DividerMeta, GridMeta, LayoutMeta, SpaceMeta,
    AffixMeta, BreadcrumbMeta, DropdownMeta, MenuMeta, PageHeaderMeta, PaginationMeta, StepsMeta, AutoCompleteMeta,
    CascaderMeta, CheckboxMeta, DatePickerMeta, FormMeta,  MentionsMeta, RadioMeta,
    SelectMeta, SliderMeta, SwitchMeta, TimePickerMeta, TransferMeta, TreeSelectMeta, UploadMeta, AvatarMeta, BadgeMeta,
    CalendarMeta, CardMeta, CarouselMeta, CollapseMeta, CommentMeta, DescriptionsMeta, EmptyMeta, ImageMeta, ListMeta, PopoverMeta,
    StatisticMeta,  TabsMeta, TagMeta, TimeLineMeta, TooltipMeta, TreeMeta]

const customInstances: Array<ComponentInstance> = [ButtonInstance]
const componentInstances: Array<ComponentInstance> = []
// ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
for (const index in componentMetas) {
    const foundInstance = customInstances.find((item: ComponentInstance) => {
        return item.componentName === componentMetas[index].componentName
    })
    if (foundInstance) {
        componentInstances.push(foundInstance)
    } else {
        const componentInstance = new ComponentInstance()
        componentInstance.componentName = componentMetas[index].componentName
        componentInstance.props = {}
        componentInstance.slots = {}
        componentInstance.children = []
        componentInstances.push(componentInstance)
    }
}
const schemaArco = {componentMetas,componentInstances}
export {schemaArco}