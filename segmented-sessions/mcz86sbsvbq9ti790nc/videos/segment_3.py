from manim import *

class KönigsbergAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        river = Line(start=LEFT * 4, end=RIGHT * 4, color=BLUE)
        island1 = Circle(radius=0.5, color=GREEN).shift(UP * 1.5 + LEFT * 1.5)
        island2 = Circle(radius=0.5, color=GREEN).shift(UP * 1.5 + RIGHT * 1.5)
        island3 = Circle(radius=0.5, color=GREEN).shift(DOWN * 1.5 + LEFT * 1.5)
        island4 = Circle(radius=0.5, color=GREEN).shift(DOWN * 1.5 + RIGHT * 1.5)

        self.play(Create(river), Create(island1), Create(island2), Create(island3), Create(island4))
        self.wait(2)

        bridge1 = Line(start=island1.get_right(), end=island2.get_left(), color=YELLOW)
        bridge2 = Line(start=island1.get_bottom(), end=island3.get_top(), color=YELLOW)
        bridge3 = Line(start=island2.get_bottom(), end=island4.get_top(), color=YELLOW)
        bridge4 = Line(start=island3.get_right(), end=island4.get_left(), color=YELLOW)
        bridge5 = Line(start=island1.get_left(), end=island3.get_right(), color=YELLOW)
        bridge6 = Line(start=island2.get_left(), end=island4.get_right(), color=YELLOW)

        self.play(Create(bridge1), Create(bridge2), Create(bridge3), Create(bridge4), Create(bridge5), Create(bridge6))
        self.wait(2)

        self.play(FadeOut(river), FadeOut(island1), FadeOut(island2), FadeOut(island3), FadeOut(island4))
        self.wait(1)

        node1 = Dot(color=RED).shift(UP * 2)
        node2 = Dot(color=RED).shift(RIGHT * 2)
        node3 = Dot(color=RED).shift(DOWN * 2)
        node4 = Dot(color=RED).shift(LEFT * 2)

        self.play(Create(node1), Create(node2), Create(node3), Create(node4))
        self.wait(1)

        edge1 = Line(start=node1.get_bottom(), end=node2.get_top(), color=WHITE)
        edge2 = Line(start=node1.get_left(), end=node3.get_right(), color=WHITE)
        edge3 = Line(start=node2.get_bottom(), end=node4.get_top(), color=WHITE)
        edge4 = Line(start=node3.get_left(), end=node4.get_right(), color=WHITE)

        self.play(Create(edge1), Create(edge2), Create(edge3), Create(edge4))
        self.wait(0.5)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(10.4)