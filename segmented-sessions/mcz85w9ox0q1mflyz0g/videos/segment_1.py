from manim import *

class GraphTheoryScene(Scene):
    def construct(self):
        title = Text("Networks, Bridges, and Color", font_size=48)
        subtitle = Text("The Beauty of Graph Theory", font_size=36)
        
        title.set_color(YELLOW)
        subtitle.set_color(BLUE)

        title.move_to(UP * 0.5)
        subtitle.next_to(title, DOWN)

        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(subtitle))
        self.wait(0.5)

        circle1 = Circle(radius=0.5).shift(LEFT)
        circle2 = Circle(radius=0.5).shift(RIGHT)
        square = Square(side_length=1).next_to(circle1, DOWN)

        self.play(Create(circle1))
        self.play(Create(circle2))
        self.play(Create(square))
        self.wait(1.6)

        self.play(FadeOut(circle1), FadeOut(circle2), FadeOut(square))
        self.wait(0.5)

        self.play(FadeOut(title), FadeOut(subtitle))
        self.wait(0.5)