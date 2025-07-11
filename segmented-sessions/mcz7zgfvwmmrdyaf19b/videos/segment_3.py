from manim import *

class KönigsbergAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        map_image = Circle(radius=0.5).scale(1.5)
        self.play(FadeIn(map_image))
        self.wait(2)

        self.play(map_image.animate.scale(1.2).shift(UP * 0.5))
        self.wait(1)

        island1 = Circle(radius=0.2, color=BLUE).shift(LEFT * 3 + UP * 2)
        island2 = Circle(radius=0.2, color=BLUE).shift(LEFT * 3 + DOWN * 2)
        island3 = Circle(radius=0.2, color=BLUE).shift(RIGHT * 3 + UP * 2)
        island4 = Circle(radius=0.2, color=BLUE).shift(RIGHT * 3 + DOWN * 2)

        bridge1 = Line(island1.get_center(), island2.get_center(), color=YELLOW)
        bridge2 = Line(island1.get_center(), island3.get_center(), color=YELLOW)
        bridge3 = Line(island2.get_center(), island4.get_center(), color=YELLOW)
        bridge4 = Line(island3.get_center(), island4.get_center(), color=YELLOW)

        self.play(FadeOut(map_image), FadeIn(island1), FadeIn(island2), FadeIn(island3), FadeIn(island4))
        self.play(Create(bridge1), Create(bridge2), Create(bridge3), Create(bridge4))
        self.wait(2)

        path1 = Line(island1.get_center(), island2.get_center(), color=GREEN)
        path2 = Line(island2.get_center(), island4.get_center(), color=GREEN)
        path3 = Line(island4.get_center(), island3.get_center(), color=GREEN)
        path4 = Line(island3.get_center(), island1.get_center(), color=GREEN)

        self.play(Create(path1), Create(path2), Create(path3), Create(path4))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        circle2 = Circle(radius=0.5)
        self.play(Create(circle2))
        self.wait(2)

        self.play(FadeOut(island1), FadeOut(island2), FadeOut(island3), FadeOut(island4), FadeOut(path1), FadeOut(path2), FadeOut(path3), FadeOut(path4))
        self.wait(1)

        self.wait(12)